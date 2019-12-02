function scrollToAnchor(id){
    var tag = $("div[id='"+ id +"']");
    $('html,body').animate({scrollTop: tag.offset().top},'slow');
}

$("#home_anchor").click(function() {
    scrollToAnchor('home');
 });
 $("#about_anchor").click(function() {
    scrollToAnchor('about');
 });
 $("#services_anchor").click(function() {
    scrollToAnchor('services');
 });
 $("#contact_anchor").click(function() {
    scrollToAnchor('contact');
 });