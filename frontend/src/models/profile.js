import React, { useEffect } from 'react';
import { Card} from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios' 
const Profile = () => {
 // Dummy data
  const [userData,setUserData] =useState({});
 useEffect(()=>{
 const fetchData=async()=>{
   const token=localStorage.getItem("jwtToken");
   if(token==null){
     console.log("token is null");
   }
   else{
     console.log("token is not null");
   }


   const decodedToken=JSON.parse(atob(token.split('.')[1]));


   const userId=decodedToken.userId;


   const response = await axios.get(`http://localhost:8000/user/${userId}`, {
     headers: {
       Authorization: `Bearer ${token}`
     }
   });
   const responseIncome = await axios.get(`http://localhost:8000/income`, {
     headers: {
       Authorization: `Bearer ${token}`
     }
   });
   const responseExpanse = await axios.get(`http://localhost:8000/expense`, {
     headers: {
       Authorization: `Bearer ${token}`
     }
   });






   if(response.status===200 && responseIncome.status===200 && responseExpanse.status===200){
     console.log(response.data);
     let income=0,expense=0;
     console.log(responseIncome.data);


     for(let i=0;i<responseIncome.data.length;i++){
         if(responseIncome.data[i].user_id.id===userId){
           income+=responseIncome.data[i].amount;
         }
     }


     for(let i=0;i<responseExpanse.data.length;i++){
       if(responseExpanse.data[i].user_id.id===userId){
         expense+=responseExpanse.data[i].amount;
       }
   }


     console.log(income);
     console.log(expense);
     const userdata=response.data;
     setUserData(
       {username: userdata.firstName,         
         fullName: userdata.fullName,
         email: userdata.email,
         phone: userdata.mobileno,
         profession: userdata.profession,
         gender: userdata.gender,
         income: income,
         expense: expense}
     )
    
     // console.log(balance);
   }
 }
 fetchData();
  
 },[]);


 
 


 let status;
 if (userData.income > userData.expense) {
   status = 'Income is more than Expense this month';
 } else if (userData.income < userData.expense) {
   status = 'Income is less than Expense this month';
 } else {
   status = 'Income equals Expense this month';
 }


 return (
   <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px' }}>
     <div className="container mt-6 d-flex justify-content-center">
       <Card style={{ width: '60%', maxWidth: '500px' }} className="text-center">
         <Card.Body>
           <div className="d-flex justify-content-center mb-4">
           </div>
           <Card.Title className="mb-3">
             <h2>{userData.username}</h2>
           </Card.Title>
           <Card.Text>
             <strong>Full Name:</strong> {userData.fullName}
           </Card.Text>
           <Card.Text>
             <strong>Email:</strong> {userData.email}
           </Card.Text>
           <Card.Text>
             <strong>Phone:</strong> {userData.phone}
           </Card.Text>
           <Card.Text>
             <strong>Profession:</strong> {userData.profession}
           </Card.Text>
           <Card.Text>
             <strong>Gender:</strong> {userData.gender}
           </Card.Text>
           <Card.Text>
             <strong>Status:</strong> {status}
           </Card.Text>
           <Card.Text>
             <strong>Income Percentage:</strong> {((userData.income / (userData.income + userData.expense)) * 100).toFixed(2)}%
           </Card.Text>
           <Card.Text>
             <strong>Expense Percentage:</strong> {((userData.expense / (userData.income + userData.expense)) * 100).toFixed(2)}%
           </Card.Text>
           <Card.Text>
             <strong>Balance:</strong> {userData.income-userData.expense}
           </Card.Text>
         </Card.Body>
       </Card>
     </div>
   </div>
 );
};


export default Profile;




