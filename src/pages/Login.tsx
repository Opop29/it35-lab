import { 
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent, 
  IonInput,  
  IonPage,  
  IonToast,  
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import './css/login.css'; 

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const doregister = async ( )  => {}
  const doLogin = async () => {
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailPattern)) {
        setErrorMessage('Please enter a valid email address.');
        setShowAlert(true);
        return; 
    }

    if (!password) {
        setErrorMessage('Password cannot be empty.');
        setShowAlert(true);
        return;
    }

    setShowAlert(false);
    setShowToast(true);
    setTimeout(() => {
        navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 1500);
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

              <IonToast
                  isOpen={showToast}
                  onDidDismiss={() => setShowToast(false)}
                  message="Login successful! Redirecting..."
                  duration={1500}
                  position="top"
                  color="primary"
              />
          </IonContent>
      </IonPage>
  );
};

export default Login;
