import "./styles/index.css";
import { ContactModal } from "./scripts/modules/ContactModal.js";

const bootstrap = (): void => {
   
  new ContactModal();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
