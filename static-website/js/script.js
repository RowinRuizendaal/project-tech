function hamburger() {
    document.querySelector("nav ul").classList.toggle("popnav");
    console.log('Navigatie klik');
}

document.querySelector(".hamburger").addEventListener("click", hamburger);