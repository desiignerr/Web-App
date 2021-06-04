<?php
session_start();
require 'system/autoload.php';
if($_SERVER['REQUEST_METHOD'] =='POST'){
    $admin = new \Controllers\AccountController();
    if($admin->verifyAccount()){
        $_SESSION['admin'] = 'loggedIn';
    }else{
        $error = 'Error';
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin</title>
    <link rel="stylesheet" type="text/css" href="dist/css/font-awesome.min.css">
</head>
<body>
<?php if(isset($_SESSION['admin'])):  ?>
<div id="admin">

</div>
<?php else:;?>
<nav class=" deep-orange accent-3">
    <div class="nav-wrapper container ">
        <a href="#" class="brand-logo">GTBank</a>
    </div>
</nav>
<div class="main">
    <div class="container">
        <div class="row">
            <div class="col offset-m3 m6">
                <div class="card-panel">
                    <h5>Admin Login</h5>
                    <?php if(isset($error)):?>
                        <p class="red-text">Invalid Username or password</p>
        <?php endif;?>
                    <form method="post" action="admin.php">
                        <div class="input-field">
                            <input type="text" id="username" name="username" class="validate" required/>
                            <label for="username">Username</label>
                        </div>
                        <div class="input-field">
                            <input type="password" id="password" name="password" class="validate" required/>
                            <label for="password">Password</label>
                        </div>
                        <div class="button">
                            <button class="btn btn-large">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endif ?>
<script type="text/javascript" src="dist/js/admin.bundle.js"></script>
</body>
</html>

<template>
    <div class="card-panel">
        <h5>Security Questions</h5>
        <error-alert v-bind:message="errorMsg" ref="errorAlert"></error-alert>
        <success-alert v-bind:message="successMsg" ref="successAlert" not-flash ></success-alert>
        <form method="post" @submit.prevent="sendRequest($event)">
           <div class="input-field">
               <input type="text" id="qus1"  class="validate" name="answer1" required/>
               <label for="qus1">{{ question1 }}</label>
           </div>
            <div class="input-field">
                <input type="text" id="qus2" class="validate" name="answer2" required />
                <label for="qus2">{{ question2}}</label>
            </div>
            <div class="button">
                <button type="submit" class="btn waves-effect btn-large">Request Card</button>
            </div>
        </form>
    </div>
</template>

<script>
    import ErrorAlert from '../../common/Alerts/ErorrAlert.vue';
    import SuccessAlert from '../../common/Alerts/SuccessAlert.vue';
    import axios from 'axios';
    export default {
        name: "SecurityQuestion",
        components:{ErrorAlert,SuccessAlert},
        data:()=>({
            question1:'',
            question2:'',
            errorMsg:'',
            successMsg:''
        }),
        methods:{
            getQuestions(){
                axios.get('api.php?request=get_questions&id='+this.$store.state.customer.id)
                    .then(res=>{
                        this.question1 = res.data.question1;
                        this.question2 = res.data.question2;
                    })
            },
            sendRequest(event){
                //console.log('called');
                const data = new FormData(event.target);
                data.append('id',this.$store.state.customer.id);
                data.append('card_type',this.$store.state.preference.card_type);
                data.append('reason',this.$store.state.preference.reason);

                axios.post('api.php?request=request_card',data)
                    .then(res=>{
                        const data = res.data;
                        console.log(data);
                        if(data.status == 'success'){
                            this.successMsg = `Card request was sent successfully your tracking code is <strong>${data.tracking_code}</strong>`;
                            this.$refs.successAlert.showAlert();
                        }else {
                            this.errorMsg = data.error;
                            this.$refs.errorAlert.showAlert();
                        }

                    })

            }
        },
        created(){
            if(!this.$store.state.customer.id)
                this.$router.push('/card/request');

            this.getQuestions();
        }

    }
</script>
<style scoped lang="scss">
    @import "../../../sass/palette";
    .btn{
        background: $primary-color-dark;
    }
    .button{
        text-align: center;
    }
</style>
<template>
    <div class="container white z-depth-2">
        <form method="post" enctype="multipart/form-data" v-on:submit.prevent="registerCustomer($event)">

                <error-alert v-for="message in errorMessages"  not-flash v-bind:message="message"></error-alert>
                <success-alert message="Customer was added successfully" ref="successAlert"></success-alert>
                <error-alert v-bind:message="errorMessage" ref="errorAlert"></error-alert>

            <div class="row">
                <div class="col s12">
                    <div class="row">

                        <div class="col m3">
                          <div class="avatar-wrapper" title="Click to upload passport photograph" @click="showUploadDialog">
                              <div class="cover" v-show="noPassport">
                                  <div class="cell">
                                      <p>Upload Passport Photograph</p>
                                  </div>
                              </div>
                              <img src="dist/images/avartar.png" ref="passportPhoto" class="responsive-img"/>
                              <input type="file" accept="image/*"  @change="showPassport" name="passport" ref="passport"/>
                          </div>

                        </div>
                    </div>
                </div>

                <div class="input-field col m4">
                    <input type="text" name="last_name" v-model="customer.last_name" id="last_name" class="validate" required/>
                    <label for="last_name">Last Name</label>
                </div>
                <div class="input-field col m4">
                    <input type="text" name="first_name" v-model="customer.first_name" id="first_name" class="validate" required/>
                    <label for="first_name">First Name</label>
                </div>
                <div class="input-field col m4">
                    <input type="text" name="middle_name" v-model="customer.middle_name" id="middle_name" class="validate" required/>
                    <label for="middle_name">Middle Name</label>
                </div>
                <div class="col m4 input-field">
                    <select name="gender" id="gender" v-model="customer.gender" class="validate" required>
                        <option value="" disabled selected>Choose gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <label for="gender">Gender</label>
                </div>

                <div class="input-field col m4">
                    <input type="date" name="dob" v-model="customer.dob" id="dob" class="validate" required/>
                    <label for="dob">Date of Birth</label>
                </div>
                <div class="input-field col m4">
                    <input type="text" name="occupation" v-model="customer.occupation" id="occupation" class="validate" required/>
                    <label for="occupation">Occupation</label>
                </div>

                <div class="input-field col m4">
                    <input type="text" name="mobile_one" v-model="customer.mobile1" id="mobile_one" class="validate" required/>
                    <label for="mobile_one">Mobile 1</label>
                </div>
                <div class="input-field col m4">
                    <input type="text" name="mobile_two"  v-model="customer.mobile2" id="mobile_two"/>
                    <label for="mobile_two">Mobile 2(optional)</label>
                </div>
                <div class="input-field col m4">
                    <input type="email" name="email" v-model="customer.email" id="email"/>
                    <label for="email">Email Address</label>
                </div>
                <div class="input-field col m4">
                    <input type="text" name="home_address"  v-model="customer.address" id="home_address" class="validate" required/>
                    <label for="home_address">Home Address</label>
                </div>
                <div class="input-field col m4">
                    <input type="text" name="landmark" v-model="customer.landmark" id="landmark" class="validate" required/>
                    <label for="landmark">Landmark of Home Address</label>
                </div>

                <div class="input-field col m4">
                    <input type="text" name="state" v-model="customer.state" id="state" class="validate" required/>
                    <label for="state">State</label>
                </div>

                <div class="input-field col m4">
                    <input type="text" name="city" v-model="customer.city" id="city" class="validate" required/>
                    <label for="city">City</label>
                </div>
                <div class="col m4 input-field">
                        <select name="id_type" v-model="customer.id_type">
                            <option value="" disabled selected>Choose your option</option>
                            <option value="International Passport">International Passport</option>
                            <option value="Drivers Licence">Drivers Licence</option>
                            <option value="Voters Card">Voters Card</option>
                            <option value="National ID Card">National ID Card</option>
                        </select>
                        <label>Identification type</label>
                </div>
                <div class="input-field col s4">
                    <input type="text" name="id_number" v-model="customer.id_number" id="id_number" class="validate" required/>
                    <label for="id_number">ID Number</label>
                </div>
                <div class="input-field col s4">
                    <input type="date" name="issue_date" v-model="customer.issue_date" id="issue_date" class="validate" required/>
                    <label for="issue_date">Issue Date</label>
                </div>
                <div class="input-field col s4">
                    <input type="date" name="expiry_date" v-model="customer.expiry_date" id="expiry_date" class="validate" required/>
                    <label for="expiry_date">Expiry Date</label>
                </div>
                <div class="input-field col s4">
                    <input type="number" name="balance" v-model="customer.balance" id="balance" class="validate" required/>
                    <label for="balance">Opening Balance</label>
                </div>
                <div class="input-field col m6">
                    <select name="question1" v-model="customer.question1" id="question1" class="validate" required>
                        <option value="" disabled selected>Select Question</option>
                        <option value="What Is your favorite book?">What Is your favorite book? </option>
                        <option value="What is the name of the road you grew up on?"> What is the name of the road you grew up on?</option>
                        <option value="What is your mother’s maiden name?"> What is your mother’s maiden name?</option>
                        <option value="Where did you meet your spouse?"> Where did you meet your spouse?</option>
                        <option value="What is your favorite food?">What is your favorite food? </option>
                    </select>


                    <label for="question1">Security Question 1</label>
                </div>
                <div class="input-field col m6">
                    <input type="text" name="answer1" v-model="customer.answer1" id="answer1" class="validate" required/>
                    <label for="answer1">Security Answer 1</label>
                </div>
                <div class="input-field col s6">
                    <select name="question2" v-model="customer.question2" id="question2" class="validate" required>
                        <option value="" disabled selected>Select Question</option>
                        <option value="What Is your favorite book?">What Is your favorite book? </option>
                        <option value="What is the name of the road you grew up on?"> What is the name of the road you grew up on?</option>
                        <option value="What is your mother’s maiden name?"> What is your mother’s maiden name?</option>
                        <option value="Where did you meet your spouse?"> Where did you meet your spouse?</option>
                        <option value="What is your favorite food?">What is your favorite food? </option>
                    </select>
                    <label for="question2">Security Question 2</label>
                </div>
                <div class="input-field col s6">
                    <input type="text" v-model="customer.answer2" name="answer2" id="answer2" class="validate" required/>
                    <label for="answer2">Security Answer 2</label>
                </div>
            </div>
            <div class="button">
                <button class="btn btn-large waves-effect">Create Account</button>
            </div>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';
    import ErrorAlert from '../common/Alerts/ErorrAlert.vue';
    import SuccessAlert from '../common/Alerts/SuccessAlert.vue';
    export default {
        name: "AddCustomerForm",
        components:{ErrorAlert,SuccessAlert},
        data:()=>({
            noPassport:true,
            errorMessages:[],
            errorMessage:'',
            customer:{
                first_name:'',
                last_name:'',
                middle_name:'',
                dob:'',
                gender:'',
                mobile1:'',
                mobile2:'',
                email:'',
                occupation:'',
                address:'',
                landmark:'',
                state:'',
                city:'',
                id_type:'',
                id_number:'',
                issue_date:'',
                expiry_date:'',
                balance:'',
                question1:'',
                question2:'',
                answer1:'',
                answer2:'',

            }
        }),
        methods:{
          showUploadDialog(){
              this.$refs.passport.click();
          },

          showPassport(){
                const reader = new FileReader();
                reader.onload = event=>{
                    this.$refs.passportPhoto.src = event.target.result;
                    this.noPassport = false;
                };
                reader.readAsDataURL(this.$refs.passport.files[0])
          },
          registerCustomer(event){
              const cusData = new FormData(event.target);
              if(this.noPassport){
                  document.querySelector('.avatar-wrapper').style.borderColor = 'red';
                 // this.$refs.errorAlert.showAlert();
              }else {
                  axios.post('api.php?request=add_customer',cusData).then(res=>{
                          const data = res.data;
                          if(data.status == 'success'){
                              Object.getOwnPropertyNames(this.customer).forEach((name)=>{
                                  this.customer[name]='';
                                  this.$refs.passport.value ='';
                                  this.$refs.passportPhoto.src = 'dist/images/avartar.png';
                                  document.querySelector('.avatar-wrapper').style.borderColor = 'lightgray';
                                  this.noPassport = true;
                              });
                              this.$refs.successAlert.showAlert();
                          }else{
                              this.errorMessages = data.errors;
                              //this.$refs.successAlert.showAlert();
                          }
                      },
                      ()=>{


                      })
              }
          }
        },
        mounted(){
            this.$nextTick(function () {
                var elems = document.querySelectorAll('select');
                var instances = M.FormSelect.init(elems);
            })
        }
    }
</script>

<style scoped lang="scss">
    @import "../../sass/palette";
    .avatar-wrapper{
        border:solid lightgray 1px;
        margin: 15px;
        position: relative;

        img{
            padding: 10px;
        }


        .cover{
            position: absolute;
            text-align: center;
            background: transparentize(gray,.6);
            height: 100%;
            padding-top: 30%;
            cursor: pointer;
        }

        .cell{
            p{
                font-weight: bold;
                color: black;
            }
        }

        input[type='file']{
            display: none;
        }
    }
    .button{
        text-align: center;
        padding: 10px 0;
        padding-bottom: 30px;

        .btn{
            background: $primary-color;
        }
    }
</style>

