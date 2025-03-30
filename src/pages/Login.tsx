import { 
    IonAlert,
    IonAvatar,
    IonButton,
    IonContent, 
    IonInput,  
    IonPage,  
    IonLoading,
    useIonRouter
  } from '@ionic/react';
  import { useState } from 'react';
  import './css/login.css'; 
  import { supabase } from '../utils/supabaseClient';
  import bcrypt from 'bcryptjs';
  
  const Login: React.FC = () => {
    const navigation = useIonRouter();
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
  
    const doLogin = async () => {
      if (!email || !password) {
          setErrorMessage('Please enter both email and password.');
          setShowAlert(true);
          return;
      }
      
      if (!email.endsWith("@Anime.world.ph")) {
          setErrorMessage("Only @Anime.world.ph emails are allowed to login.");
          setShowAlert(true);
          return;
      }
  
      setLoading(true); 
  
      try {
       
          const { data: users, error } = await supabase
              .from('users')
              .select('user_id, email, password')
              .eq('email', email)
              .single();
  
          if (error || !users) {
              setLoading(false);
              setErrorMessage("User not found. Please register first.");
              setShowAlert(true);
              return;
          }
  
          const passwordMatch = await bcrypt.compare(password, users.password);
          if (!passwordMatch) {
              setLoading(false);
              setErrorMessage("Incorrect password. Please try again.");
              setShowAlert(true);
              return;
          }
  
          setTimeout(() => {
              setLoading(false);
              navigation.push('/it35-lab/app', 'forward', 'replace');
          }, 2000); 
  
      } catch (err) {
          setLoading(false);
          setErrorMessage("An error occurred. Please try again later.");
          setShowAlert(true);
      }
    };
  
    const goToRegister = () => {
      navigation.push('/it35-lab/app/Register', 'forward');
    };
  
    return (
        <IonPage>
            <IonContent className="login-page">
                <div className="login-container">
                    <IonAvatar className="login-avatar">
                        <img src="https://m.media-amazon.com/images/I/61rYhM2ECwL._AC_UF894,1000_QL80_.jpg" alt="Anime Logo" className="login-icon" />
                    </IonAvatar>
  
                    <h1 className="login-title"> "Welcome, Anime Enthusiast!"</h1>
                    <IonInput
                        label="Email"
                        labelPlacement="floating"
                        fill="outline"
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onIonChange={e => setEmail(e.detail.value!)}
                        className="login-input"
                    />
                    <IonInput
                        label="Password"
                        labelPlacement="floating"
                        fill="outline"
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onIonChange={e => setPassword(e.detail.value!)}
                        className="login-input"
                    />
                    <IonButton onClick={doLogin} expand="full" shape="round" className="login-button">
                        Login
                    </IonButton>
                    <h5> "Join the Anime World! by:"</h5>
                    <IonButton onClick={goToRegister} expand="full" shape="round" className="register-button">
                        Register
                    </IonButton>
                </div>
  
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Login Failed"
                    message={errorMessage}
                    buttons={['OK']}
                />
  
                {/* Loading Screen */}
                <IonLoading
                    isOpen={loading}
                    message="Logging in... Please wait."
                    spinner="circles"
                />
            </IonContent>
        </IonPage>
    );
  };
  
  export default Login;
  