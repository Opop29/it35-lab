import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonAlert, IonToast } from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import './css/register.css';

const Register: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const doRegister = async () => {
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailPattern)) {
      setErrorMessage('Please enter a valid email address.');
      setShowAlert(true);
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage('Password and confirmation cannot be empty.');
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setShowToast(true);

    setTimeout(() => {
      navigation.push('/it35-lab', 'back');  
    }, 1500);
  };

  const goBackToLogin = () => {
    navigation.push('/it35-lab', 'back'); 
  };

  return (
    <IonPage>
      <IonContent className="register-page">
        <div className="register-container">
          <h1 className="register-title">Create Your Account</h1>
          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            className="register-input"
          />
          <IonInput
            label="Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Enter Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            className="register-input"
          />
          <IonInput
            label="Confirm Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onIonChange={e => setConfirmPassword(e.detail.value!)}
            className="register-input"
          />
          <IonButton onClick={doRegister} expand="full" shape="round" className="register-button">
            Register
          </IonButton>

          <IonButton onClick={goBackToLogin} expand="full" shape="round" className="back-button">
            Back to Login
          </IonButton>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Registration Failed"
          message={errorMessage}
          buttons={['OK']}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Registration successful! Redirecting..."
          duration={1500}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
