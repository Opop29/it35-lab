import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonModal,
  IonAlert
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleOpenVerificationModal = () => {
    if (!email.endsWith("@nbsc.edu.ph")) {
      setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
      setShowAlert(true);
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setShowAlert(true);
      return;
    }
    setShowVerificationModal(true);
  };

  const doRegister = async () => {
    setShowVerificationModal(false);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error("Account creation failed: " + error.message);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { error: insertError } = await supabase.from("users").insert([{
        username,
        user_email: email,
        user_firstname: firstName,
        user_lastname: lastName,
        user_password: hashedPassword,
      }]);

      if (insertError) throw new Error("Failed to save user data: " + insertError.message);

      setShowSuccessModal(true);
    } catch (err) {
      setAlertMessage(err instanceof Error ? err.message : "An unknown error occurred.");
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-container">
       

        <h1 className="login-header">Create your account</h1>

        <IonInput className="login-input" label="Username" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter a unique username" value={username} onIonChange={e => setUsername(e.detail.value!)} />
        <IonInput className="login-input" label="First Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your first name" value={firstName} onIonChange={e => setFirstName(e.detail.value!)} />
        <IonInput className="login-input" label="Last Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your last name" value={lastName} onIonChange={e => setLastName(e.detail.value!)} />
        <IonInput className="login-input" label="Email" labelPlacement="stacked" fill="outline" type="email" placeholder="youremail@nbsc.edu.ph" value={email} onIonChange={e => setEmail(e.detail.value!)} />
        <IonInput className="login-input" label="Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Enter password" value={password} onIonChange={e => setPassword(e.detail.value!)} >
          <IonInputPasswordToggle slot="end" />
        </IonInput>
        <IonInput className="login-input" label="Confirm Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Confirm password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} >
          <IonInputPasswordToggle slot="end" />
        </IonInput>

        <IonButton onClick={handleOpenVerificationModal} expand="full" shape="round">Register</IonButton>

        <p className="register-text">Already have an account? <a href="/it35-lab/">Sign in</a></p>

        <IonModal isOpen={showVerificationModal} onDidDismiss={() => setShowVerificationModal(false)}>
          <IonContent className="ion-padding">
            <h2>Confirm Registration?</h2>
            <p>Click confirm to complete registration process.</p>
            <IonButton expand="full" onClick={doRegister}>Confirm</IonButton>
            <IonButton expand="full" fill="clear" onClick={() => setShowVerificationModal(false)}>Cancel</IonButton>
          </IonContent>
        </IonModal>

        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
          <IonContent className="ion-padding">
            <h2 style={{ textAlign: 'center', color: 'green' }}>Registration Successful!</h2>
            <IonButton expand="full" routerLink="/it35-lab/">Go to Login</IonButton>
          </IonContent>
        </IonModal>

        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        <style>{`
  ion-content {
    --background: transparent;
    background-image: url('https://i.gifer.com/origin/a4/a4fb1ab272da13569b081edaea1b2586_w200.gif');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.65);
    padding: 30px;
    border-radius: 20px;
    backdrop-filter: blur(6px);
    box-shadow: 0 0 20px aqua;
    width: 90%;
    max-width: 500px;
    height: auto;
  }

  .login-header {
    font-size: 28px;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 8px aqua;
    text-align: center;
    margin-bottom: 20px;
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
`}</style>

      </IonContent>
    </IonPage>
  );
};

export default Register;
