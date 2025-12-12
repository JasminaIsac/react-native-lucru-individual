# Project Management App – Dare de seamă

## 1. Interfață și Experiența Utilizatorului (UI/UX)
Aplicația oferă o interfață modernă, intuitivă și responsivă, adaptată pentru dispozitive mobile.  
Componentele personalizate (input-uri, butoane, pickere, modale) asigură o experiență coerentă și plăcută pentru utilizator.


## 2. Navigare folosind Expo Router cu Tipuri de Navigatori
Navigarea între ecrane este gestionată cu ajutorul expo-router.  
Sunt folosiți atât Stack Navigators (pentru fluxuri de autentificare sau detalii), cât și Tab Navigators (pentru secțiuni principale ale aplicației).
![Tabs Navigation](image-10.png)  ![Stack Navigation](image-11.png)

## 3. Gestionarea State-ului (State Management)
State-ul global este gestionat cu ajutorul contextelor React (Context API).  
Exemple: context pentru utilizator (autentificare), context pentru proiecte, context pentru notificări.
![auth context](image.png)

## 4. Formulare și Validare
Toate formularele folosesc react-hook-form pentru gestionarea datelor și a validărilor.  
Validarea datelor este realizată cu ajutorul bibliotecii zod, asigurând reguli stricte și feedback instant utilizatorului.
![Zod schema](image-1.png)![React Hook Form setup](image-2.png)

## 5. Networking și Date Asincrone
Pentru comunicarea cu backend-ul, aplicația folosește axios.  
Datele sunt preluate și trimise asincron către un API extern (backend propriu), cu gestionarea erorilor și a stărilor de încărcare.
![Axios API Client](image-3.png)

## 6. Stocare Securizată
Tokenul de autentificare este stocat în siguranță folosind expo-secure-store, protejând datele sensibile ale utilizatorului.
![Get Item from Secure Store](image-4.png)![Set Item in Secure Store](image-5.png)

## 7. Utilizarea expo-camera, expo-image-picker, expo-media-library și permisiunile aferente
Utilizatorii pot adăuga imagini sau pot face poze direct din aplicație, folosind expo-camera și expo-image-picker.  
Pentru accesul la galerie și media, este folosit expo-media-library.  
Permisiunile pentru cameră, galerie și media sunt gestionate centralizat, cu feedback clar pentru utilizator în caz de refuz.
![Camera Permission](image-6.png) 
![expo-image-picker example](image-7.png)
![Permission request example](photo_2025-12-12_18-11-53.jpg)
![Image Picker](photo_2025-12-12_18-11-55.jpg)

## 8. Notificări Locale cu expo-notifications
Aplicația trimite notificări locale folosind expo-notifications.  
Permisiunile pentru notificări sunt cerute la nevoie, iar notificările pot fi programate sau trimise instant, cu feedback vizual pentru utilizator.
![Notifications Permission](image-8.png)
![Notification context](image-9.png)
![Notifications Example](photo_2025-12-12_18-11-41.jpg)

## Vizualul aplicației
![App Screens](image-12.png)