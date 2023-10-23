window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  const navLinks =  document.getElementsByClassName("nav__link");

  if (window.scrollY > 0) {
    header.classList.add("scrolled"); //Se agregar a header la nueva clase scrolled
  
    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].style.color = "#FFFFFF";
    }
  } 
  else {
    header.classList.remove("scrolled"); //Se elimina la clase cuando scrollY deja de ser 0
    
    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].style.color = ""; // Esto restablecerá el color al valor predeterminado.
  } 
}
});
