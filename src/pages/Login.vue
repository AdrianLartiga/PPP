<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Espacio para el logo -->
      <div class="logo-placeholder">
        <img src="@/assets/image-icon.png" alt="PowerTask Logo" class="logo-image" />
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="onSubmit" class="login-form">
        <!-- Campo Usuario -->
        <div class="input-group">
          <i class="pi pi-user icon-large"></i>
          <InputText
            v-model="username"
            placeholder="Usuario"
            class="input-field"
          />
        </div>

        <!-- Campo Contraseña -->
        <div class="input-group">
          <i class="pi pi-lock icon-large"></i>
          <InputText
            v-model="password"
            type="password"
            placeholder="Contraseña"
            class="input-field"
          />
        </div>

        <Button
          label="Iniciar Sesión"
          type="submit"
          class="login-button"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router'


const username = ref('');
const password = ref('');
const router = useRouter()

const onSubmit = () => {
  router.push('/profile')
  console.log('Usuario:', username.value);
  console.log('Contraseña:', password.value);
  // Aquí iría tu lógica de autenticación
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ff6131, #ffc067);
  padding: 20px;
}



.login-card {
  background: #f0f0f0;
  padding: 4rem 3rem; /* Aumenté el padding vertical */
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px; /* Aumenté el ancho máximo */
  text-align: center;
}

.logo-placeholder {
  margin-bottom: 2rem;
}

.logo-image {
  max-width: 300px;
  height: 300px;
}

/* Grupo de input + icono */
.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
}

/* Icono grande a la izquierda */
.icon-large {
  font-size: 1.5rem; /* Tamaño grande */
  color: #000000;
  margin-right: 0.75rem;
  min-width: 24px;
  text-align: center;
}

/*Estilo moderno para los inputs */
.input-field {
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1.1rem;
  border: 1px solid #d1d5db; /* Gris moderno (tailwind gray-300) */
  border-radius: 10px;
  background: #ffffff;
  transition: all 0.25s ease;
  outline: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.input-field:focus {
  border-color: #ffffff; /* Gris un poco más oscuro (tailwind gray-400) */
  box-shadow: 0 0 0 3px rgba(106, 61, 189, 0.15); /* Sutil resaltado con el color de acento */
}

/* Botón de login */
.login-button {
  margin-top: 2rem;
  width: 100%;
  background: #3a8a70;
  border: none;
  border-radius: 24px;
  padding: 0.85rem;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background 0.3s ease;
}

.login-button:hover {
  background: #2d6a56;
}
</style>