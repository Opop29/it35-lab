import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      ion-content {
        --background: transparent;
        background-image: url('https://i.gifer.com/origin/a4/a4fb1ab272da13569b081edaea1b2586_w200.gif');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.65);
        padding: 30px;
        border-radius: 20px;
        backdrop-filter: blur(6px);
        box-shadow: 0 0 20px aqua;
        max-width: 90%;
        margin: 25% auto 0 auto;
      }

      .login-avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
        border: 5px solid aqua;
        box-shadow: 0 0 12px aqua;
        margin-bottom: 20px;
      }

      .login-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .login-header {
        font-size: 28px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 8px aqua;
        text-align: center;
        margin-bottom: 20px;
      }

      .login-password-input {
        margin-top: 10px;
      }

      ion-input {
        width: 100%;
        --background: #111;
        --color: white;
        --placeholder-color: #aaa;
        --highlight-color-focused: aqua;
        --border-color: aqua;
        --padding-start: 16px;
        --padding-end: 16px;
        margin-bottom: 10px;
        border-radius: 10px;
      }

      ion-button {
        --background: aqua;
        --color: black;
        font-weight: bold;
        margin-top: 10px;
        box-shadow: 0 0 10px aqua;
        border-radius: 8px;
      }

      ion-button[fill="clear"] {
        color: aqua;
        --color: aqua;
        --background-hover: rgba(0, 255, 255, 0.1);
        text-decoration: underline;
        margin-top: 5px;
        font-size: 14px;
        font-weight: 500;
      }

      .login-input {
        --color: aqua;
        --placeholder-color: rgba(0, 255, 255, 0.5);
        --highlight-color-focused: aqua;
        --border-color: aqua;
        color: aqua;
        margin-bottom: 16px;
        font-size: 16px;
        --padding-start: 12px;
        --padding-end: 12px;
        --padding-top: 14px;
        --padding-bottom: 14px;
        transition: all 0.3s ease;
        border-radius: 12px;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
      }

      .login-input:hover {
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
        transform: scale(1.02);
        border-color: cyan;
      }

      .login-input:focus-within {
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
        border-color: deepskyblue;
      }

      .register-text {
        margin-top: 20px;
        text-align: center;
        color: white;
        font-size: 16px;
        font-weight: 400;
      }

      .register-text a {
        color: aqua;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease, text-shadow 0.3s ease;
      }

      .register-text a:hover {
        color: #00ffff;
        text-shadow: 0 0 10px aqua;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="login-container">
          <IonAvatar className="login-avatar">
            <img
              src="https://images.hdqwalls.com/wallpapers/solo-leveling-vx.jpg"
              alt="User Avatar"
            />
          </IonAvatar>

          <h1 className="login-header">LEVEL UP</h1>

          <IonInput
            className="login-input"
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
          />

          <IonInput
            className="login-input login-password-input"
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          <IonButton className="login-btn" onClick={doLogin} expand="full" shape="round">
            Login
          </IonButton>

          {/* Register Button */}
          <IonButton
            className="register-btn"
            routerLink="/it35-lab/register"
            expand="full"
            fill="clear"
            shape="round"
          >
            Don't have an account? Register here
          </IonButton>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Notification"
          message={alertMessage}
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




  