<template>
    <router-view />
</template>

<script>
import { connectSocket } from "./utils/ws";

export default {
  setup() {
    connectSocket();
    return {};
  }
};
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
