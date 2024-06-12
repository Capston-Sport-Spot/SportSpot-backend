## Menjalankan Secara Local
### URL 
* http://localhost:9000
* Untuk pengetesan Gunakan **POSTMAN**  


### Endpoint
### REGISTER
---
* **Route**
  * Method  : "POST"
  * Path    : /register
  * **http://localhost:9000/register**
  * **Function**  : Melakukan registrasi akun baru

* **Body**
  * {  
    "email": "newuser4@example.com",  
    "password": "test123",  
    "displayName": "New User"  
    }

* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/7cf95ef5-3761-4b7c-a034-5d2a4b6877ed)

  * Bad Result (Account has already taken)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/11802cc6-b842-4e4c-b31f-1665635f3cd0)



### LOGIN
---
* **Route**
  * Method  : "POST"
  * Path    : /login
  * **http://localhost:9000/login**
  * **Function**  : Melakukan proses login dan akan memberikan **bearer token**

* **Body**
  * {  
    "email": "newuser4@example.com",  
    "password": "test123",  
    }

* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/e0f6a4dc-4ccc-4a83-b929-4ae3b7b7b66b)

  * Bad Result (Email or pasword is wrong or not authenticate)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/bda14905-680e-49d2-b1a1-dd9b4be92c16)


### PROFILE
---
* **Route**
  * Method  : "GET"
  * Path    : /profile
  * **http://localhost:9000/profile**
  * **Function**  : Untuk mendapatkan data user seperti email dan nama memakai **Beare Token**

* **Body**
  * Membutuhkan **bearer token**
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/5937800a-1ae4-4fb8-a4d3-e27ff147c284)

* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/2eb6e2a1-472d-4f62-aa7b-5df9eaacef79)

  * Bad Result (Kesalahan memasukkan Bearer Token)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/cf3ff981-1080-4d65-85b7-77444c3ea468)


### ADDLAPANGAN
---
* **Route**
  * Method  : "POST"
  * Path    : /addLapangan
  * **http://localhost:9000/addLapangan**
  * **Function**  : Untuk menmbahkan daftar lapangan yang bisa dipesan **Hanya untuk backend bukan user** membutuhkan **API KEY**

* **Body**
  * Membutuhkan **API KEY**  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/a29df09b-42ae-4047-b43a-05b67ab151af)

  * Payload  
    {  
    >"lapanganName": "Lapangan permata",  
    >"lapanganType": "Futsal",  
    >"location": "Jl. Sudirman No.1, Jakarta",  
    >"openingHours": {  
        "start": "09:00",  
        "end": "20:00"  
    },  
    "subFields": [  
    {  
            "name": "Lapangan 1",  
            "pricePerSession": 100000,  
            "facilities": ["Shower", "Parking", "Cafeteria"]  
        },  
        {  
            "name": "Lapangan 2",  
            "pricePerSession": 100000,  
            "facilities": ["Shower", "Parking", "Cafeteria"]  
        },  
        ]  
        }  

* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/0ff2696a-00f9-48f6-9ca8-5675a0ce7e92)

  * Bad Result (Wroing API KEY)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/f138c530-49e9-42a4-a0ed-743db93548ea)



### DAFTAR LAPANGAN
---
* **Route**
  * Method  : "GET"
  * Path    : /lapangans
  * **http://localhost:9000/lapangans**
  * **Function**  : Untuk menapil seluruh daftar lapangan yang ada.

* **Body**
  * NOTING

* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/c8c57616-5782-435e-b53e-bc839af6e160)



### DAFTAR LAPANGAN SPESFIC BY ID
---
* **Route**
  * Method  : "GET"
  * Path    : /lapangans/{id}
  * **http://localhost:9000/lapangans/{id}**
  * **Function**  : Untuk menampilkan lapangan sesuai dengan id yang dimasukkan .

* **Body**
  * NOTING 

* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/5956f247-7d87-41ac-bc44-0527ab27cdfa)

  * Bad Result (WRONG ID)  
   ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/480e6dc5-0b2a-4cd9-85e6-44c463ab69ba)
