## Menjalankan Secara Local
### Notes 
* Dalam masa pengembangan untuk **addLapangan**, **updateLapangan**, **addEvent**, **updateEvent**, **addCommunity**, **updateComunity**. Dilakukan oleh backend Developer **(Tidak perlu dipakai Mobile Developer)**
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
    "email": "user@10example.com",  
    "password": "userpassword",  
    "displayName": "User Name",  
    "alamat": "Jalan Irian No 2",  
    "kota": "Makassar",  
    "hp": "08123456789"  
}
* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/729500e9-92f4-4808-96d8-f00b9bbd5a97)


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
  * **Function**  : Untuk mendapatkan data user seperti email dan nama memakai **Bearer Token**

* **Body**
  * Membutuhkan **bearer token**
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/5937800a-1ae4-4fb8-a4d3-e27ff147c284)

* **Result**
  * Good Result  
   ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/f86d4ee4-5214-410b-8483-0cecdcee4263)

* **Bad Result** (Kesalahan memasukkan Bearer Token)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/cf3ff981-1080-4d65-85b7-77444c3ea468)


### UpdateProfile
---
* **Route**
  * Method  : "PUT"
  * Path    : /profile
  * **http://localhost:9000/profile**
  * **Function**  : Untuk bisa melakukan update informasi user menggunakan **Bearer Token**

* **Body**
  * Membutuhkan **bearer token**
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/5937800a-1ae4-4fb8-a4d3-e27ff147c284)

  * {  
    "email": "user@10example.com",  
    "displayName": "Johnson",  
    "alamat": "Jalan Irian No 2",  
    "kota": "Makassar",  
    "hp": "08123456789"  
    }
    
* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/819f6c2e-6413-4ff9-84c0-f0eb9cc14766)

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

  * Payload (form-data)
    * **lapanganName** : Lapangan langit 21
    * **LapanganType** : Futsal
    * **kota**         : Makassar
    * **alamat**       : Jalan Irian No 2
    * **openingHours** : {  
            "close": "20:00",  
            "open": "09:00"  
        }
    * **subField**     : [  
    {  
        "fieldName": "Lapangan 1",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    },
    {
        "fieldName": "Lapangan 2",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    },
    {
        "fieldName": "Lapangan 3",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    },
    {
        "fieldName": "Lapangan 4",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    }  
    ]  
    * **File**  : img.png (gambar)
    
* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/e003c4a1-bccb-4a11-9d01-16710677c041)

  * Result (ketika nama lapangan sudah ada)
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/bd4fcf18-8f01-4d58-b1d6-353f079de308)  

  * Bad Result (Wroing API KEY)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/f138c530-49e9-42a4-a0ed-743db93548ea)



### DAFTAR LAPANGAN
---
* **Route**
  * Method  : "GET"
  * Path    : /lapangans
  * **http://localhost:9000/lapangans**
  * **Function**  : Untuk menapilkan seluruh daftar lapangan yang ada.

* **Body**
  * NOTING

* **Result**
  * Good Result
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/f21ef08c-da60-4df8-b408-acdc2c270e1b)



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



### UpdateLapangan
---
* **Route**
  * Method  : "PUT"
  * Path    : /lapangan/{id}
  * **http://localhost:9000/lapangan/{id}**
  * **Function**  : Untuk mengupdate lapangan berdasarkan ID - NYA **Hanya untuk backend bukan user** membutuhkan **API KEY**

* **Body**
  * Membutuhkan **API KEY**  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/a29df09b-42ae-4047-b43a-05b67ab151af)

  * Payload (form-data)
    * **lapanganName** : Lapangan langit 21
    * **LapanganType** : Futsal
    * **kota**         : Makassar
    * **alamat**       : Jalan Irian No 2
    * **openingHours** : {  
            "close": "20:00",  
            "open": "09:00"  
        }
    * **subField**     : [  
    {  
        "fieldName": "Lapangan 1",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    },
    {
        "fieldName": "Lapangan 2",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    },
    {
        "fieldName": "Lapangan 3",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    },
    {
        "fieldName": "Lapangan 4",  
        "pricePerSession": 100000,  
        "facilities": ["Shower", "Parking", "Cafeteria"]  
    }  
    ]  
    * **File**  : img.png (gambar)
    
* **Result**
  * Good Result  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/ae2c299f-0472-429a-93ae-d8917aa0b441)

  * Bad Result (Wroing API KEY)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/f138c530-49e9-42a4-a0ed-743db93548ea)

  * Bad Result (Lapangan Not Found wrong lapangan ID)  
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/3c4179fd-1fb0-4ea6-af11-53ef0ca29a5b)



### SearchLapangan
---
* **Route**
  * Method  : "GET"
  * Path    : /searchLapangan
  * **http://localhost:9000/searchLapangan**
  * **Function**  : Untuk melakukan serching lapagan menggunakan parameter nama lapangan

* **Body**
  * Membutuhkan **Params**
    http://localhost:9000/searchLapangan?keyword=Lapangan Pencak 21    
![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/1c8eed6b-8b49-49fe-a131-f9f275ac9fc9)  

* **Result**
  * Good Result  
![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/d72961c4-3c2e-4e1d-987a-13d10a56f1f4)


* **Bad Result** (Kesalahan tidak memasukkan paramter)  
  ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/620e52df-9e99-4468-b90d-d60165922c85)



### GETLapanganByKota&Type
---
* **Route**
  * Method  : "GET"
  * Path    : /searchLapanganByKotaAndType
  * **http://localhost:9000/searchLapanganByKotaAndType**
  * **Function**  : Filterisasi dimana kita bisa mendapatkan daftar lapangan berdasarkan kota yang sama dengan kita berdasarkan jenis lapangannya [Basket, Futsal, Bulu Tangkis] (Membutuhkan **Bearer Token** dan **Params**

* **Body**
  * Bearer Token
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/7e78f5cb-d8e0-4932-9aad-247c091a9c1b)

  * Params
    http://localhost:9000/searchLapanganByKotaAndType?lapanganType=Basket
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/f755142d-9828-4c42-a27c-8a304e8c50d2)


    
* **Result**
  * Good Result  
![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/51aed82c-9116-4728-9bc1-bf6c6cbc92a9)



### Reservation
---
* **Route**
  * Method  : "POST"
  * Path    : /reservations
  * **http://localhost:9000/reservations**
  * **Function**  : Untuk User bisa melakukan reservation . Membutuhkan **Bearer Token**.
  
* **Body**
  * Bearer Token
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/7e78f5cb-d8e0-4932-9aad-247c091a9c1b)

  * Payload (JSON)
    {  
    "lapanganId": "UR3h9stirAYqzJ5hrN2F",  
    "subFieldName": "Lapangan 3",  
    "date": "2024-06-13",  
    "startTime": "13:00",  
    "endTime": "16:00"  
}  

* **Result**
  * Good Result  
![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/96c9b64b-37e3-4d87-b16d-d1ba3df0cea2)  

  * Bad Result (Tidak dapat memesan lapangan dimasa lalu)
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/ffed4720-d645-4442-a41c-5938a0849e08)

  * Bad Result (Tidak dapat memsan lapangan diluar jam operasional)
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/47090c1b-d262-4f4a-8243-1e80733e0ec2)


### GetUserReservation
---
* **Route**
  * Method  : "GET"
  * Path    : /reservations
  * **http://localhost:9000/reservations**
  * **Function**  : Untuk user dapat melihat reservasi yang telah ia lakukan . Membutuhkan **Bearer Token**.
  
* **Body**
  * Bearer Token
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/7e78f5cb-d8e0-4932-9aad-247c091a9c1b)


* **Result**
  * Good Result  
![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/4b4a3456-19c6-4a63-8e24-690879f4a0ee)  

  * Bad Result (Tidak dapat memesan lapangan dimasa lalu)
    Nothing (tidak ada reservasi/kosong)



### GetsubLapanganReservation
---
* **Route**
  * Method  : "GET"
  * Path    : /reservations/{id Lapangan}/nama_SubLapangan
  * **http://localhost:9000/reservations/{id Lapangan}/nama_SubLapangan**
  * **Function**  : Untuk dapat melihat reservasi apa saja yang sudah terjadi di satu field dalam lapangan.

* **Result**
  * Good Result
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/2c538161-0b83-4bb3-9ab4-3ed55b3091a1)  


  * Bad Result (Tidak dapat memesan lapangan dimasa lalu)
    Nothing (tidak ada reservasi/kosong)



### GetHistoryReservationUSer
---
* **Route**
  * Method  : "GET"
  * Path    : /reservations/history
  * **http://localhost:9000/reservations/history**
  * **Function**  : Untuk melihat history reservation user yang telah berlalu.. Membutuhkan **Bearer Token**.
  
* **Body**
  * Bearer Token
    ![image](https://github.com/Capston-Sport-Spot/SportSpot-backend/assets/120615297/7e78f5cb-d8e0-4932-9aad-247c091a9c1b)


* **Result**
  * Good Result  

  * Bad Result (Tidak dapat memesan lapangan dimasa lalu)


    
 


