"use strict"; 

function UsersComingSoon() {

  var ele = document.createElement("div");
  ele.classList.add("usersComingSoon");
  ele.innerHTML = `
    <h3>Users Coming Soon (JavaScript)</h3>
    <p>Our user page is under construction. Check back soon for updates!</p>
  `;
  return ele;
  
}
