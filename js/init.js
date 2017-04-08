var view = new View();
const backend = new Backend();
Session.init();
console.log('Session.init() has been called!');
window.onload = function() {

  view.showNavigation();

}
