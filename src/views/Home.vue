<template>
  <div class="login-container" v-if="!user">
    <div class="row">
      <div class="col-md-6 login-form-1">
        <h3>Entrar</h3>
        <form @submit.prevent="loginTo">
          <div class="form-group mb-2">
            <input
              type="email"
              class="form-control"
              placeholder="Seu email *"
              v-model="login.email"
            />
          </div>
          <div class="form-group mb-2">
            <input
              type="password"
              class="form-control"
              placeholder="Sua senha *"
              v-model="login.password"
            />
          </div>
          <div class="form-group">
            <input type="submit" class="btnSubmit" value="Entrar" />
          </div>
        </form>
      </div>
      <div class="col-md-6 login-form-2">
        <h3>Registrar</h3>
        <form @submit.prevent="registerTo">
          <div class="form-group mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Seu nome *"
              v-model="register.name"
            />
          </div>
          <div class="form-group mb-2">
            <input
              type="email"
              class="form-control"
              placeholder="Seu email *"
              v-model="register.email"
            />
          </div>
          <div class="form-group mb-2">
            <input
              type="password"
              class="form-control"
              placeholder="Sua senha *"
              v-model="register.password"
            />
          </div>
          <div class="form-group">
            <input type="submit" class="btnSubmit" value="Registrar" />
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 
    CHAT
  -->

  <section style="background-color: #eee" class="central"  v-else>
    <div class="container py-5">
      <div class="row central">
        <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
          <h5 class="font-weight-bold mb-3 text-center text-lg-start">
            SAGIP CHAT - {{ user.user.email }}
          </h5>

          <div class="card">
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li
                  class="p-2 border-bottom"
                  :class="{ currentChat: currentChat == 'sagip' }"
                  @click="changeChat('sagip')"
                >
                  <a href="#!" class="d-flex justify-content-between">
                    <div class="d-flex flex-row align-items-center">
                      <img
                        src="https://www.petroeng.com.br/sagip/public/images/icon.png"
                        alt="avatar"
                        class="
                          rounded-circle
                          d-flex
                          align-self-center
                          me-3
                          shadow-1-strong
                        "
                        width="60"
                      />
                      <div class="pt-1">
                        <p class="fw-bold mb-0">SAGIP</p>
                      </div>
                    </div>
                  </a>
                </li>
                <li
                  v-for="u in users"
                  :key="u.email"
                  class="p-2 border-bottom"
                  @click="changeChat(u.email)"
                  :class="{ currentChat: currentChat == u.email }"
                >
                  <a href="#!" class="d-flex justify-content-between">
                    <div class="d-flex flex-row align-items-center">
                      <img
                        src="https://www.petroeng.com.br/sagip/public/images/icon.png"
                        alt="avatar"
                        class="
                          rounded-circle
                          d-flex
                          align-self-center
                          me-3
                          shadow-1-strong
                        "
                        width="60"
                      />
                      <div class="pt-1">
                        <p class="fw-bold mb-0">{{ u.email }}</p>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-7 col-xl-8" style="height: 100%;">
          <ul class="list-unstyled" style="height: 100%;">
            <div class="box-mensagens">
              <li class="d-flex mb-4" v-for="msg in messages" :key="msg.id" :class="{'flex-row-reverse': msg.from == user.user.email}">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png"
                  alt="avatar"
                  class="
                    rounded-circle
                    d-flex
                    align-self-start
                    mx-3
                    shadow-1-strong
                  "
                  width="60"
                />
                <div class="card">
                  <div class="card-header d-flex justify-content-between p-3">
                    <p class="fw-bold mb-0">{{ msg.from }} </p>
                    <p class="text-muted small mb-0 px-3">
                      <i class="far fa-clock"></i> {{ msg.data }}
                    </p>
                  </div>
                  <div class="card-body">
                    <p class="mb-0">
                      {{ msg.message }}
                    </p>
                  </div>
                </div>
              </li>
            </div>
            
            <li class="bg-white mb-3 box-inputmensagem">
              <div class="form-outline">
                <textarea
                  class="form-control"
                  id="textAreaExample2"
                  rows="4"
                  v-model="message"
                ></textarea>
                <label class="form-label" for="textAreaExample2">Message</label>
              </div>
            </li>
            <button
              type="button"
              class="btn btn-info btn-rounded float-end"
              @click="createMessage"
            >
              Enviar
            </button>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive, ref } from "vue";
import {
  auth,
  messageCreate,
  messageGet,
  userAll,
  userCreate,
} from "../store/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // signOut,
} from "firebase/auth";

import moment from "moment";

export default {
  setup() {
    const user = ref({});
    user.value = JSON.parse(localStorage.getItem("user")) ?? null;

    const users = userAll();

    const message = ref("");

    const currentChat = ref("sagip");
    
    let messages = messageGet("sagip");

    const login = reactive({
      email: "",
      password: "",
    });

    const loginTo = () => {
      const { email, password } = login;
      signInWithEmailAndPassword(auth, email, password)
        .then((usuario) => {
          user.value = usuario;
          localStorage.setItem("user", JSON.stringify(usuario));
        })
        .catch((error) => alert(error.message));
    };

    const register = reactive({
      email: "",
      password: "",
      name: "",
    });

    const registerTo = () => {
      const { email, password } = register;
      createUserWithEmailAndPassword(auth, email, password)
        .then((usuario) => {
          user.value = usuario;
          userCreate(register);
          localStorage.setItem("user", JSON.stringify(usuario));
        })
        .catch((error) => alert(error.message));
    };

    const changeChat = (chat) => {
      currentChat.value = chat;
    };
    const createMessage = () => {
      if (message.value == "") return;
      const store = {
        from: user.value.user.email,
        to: currentChat.value,
        message: message.value,
        data: moment().format("D/MM/yyyy HH:mm:ss"),
      };
      messageCreate(store);
      message.value = "";
    };
    
    return {
      user,
      users,
      login,
      loginTo,
      register,
      registerTo,
      currentChat,
      changeChat,
      createMessage,
      message,
      messages,
    };
  },
};

</script>

<style>
.currentChat {
  background-color: #eee;
}

.login-container {
  margin-top: 5%;
  margin-bottom: 5%;
}
.login-form-1 {
  padding: 5%;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-1 h3 {
  text-align: center;
  color: #333;
}
.login-form-2 {
  padding: 5%;
  background: #0062cc;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-2 h3 {
  text-align: center;
  color: #fff;
}
.login-container form {
  padding: 10%;
}
.btnSubmit {
  width: 50%;
  border-radius: 1rem;
  padding: 1.5%;
  border: none;
  cursor: pointer;
}
.login-form-1 .btnSubmit {
  font-weight: 600;
  color: #fff;
  background-color: #0062cc;
}
.login-form-2 .btnSubmit {
  font-weight: 600;
  color: #0062cc;
  background-color: #fff;
}
.login-form-2 .ForgetPwd {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.login-form-1 .ForgetPwd {
  color: #0062cc;
  font-weight: 600;
  text-decoration: none;
}

.central {
  height: 100vh;
}

.box-mensagens {
  max-height: calc(100% - 16rem);
  overflow-y: scroll;
}

.box-inputmensagem{
  height: 6rem;
  margin-top: 1rem;
}
</style>