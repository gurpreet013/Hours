jQuery ->
  $("#user-nav").click (event) ->
    event.stopPropagation()
    $(".dropdown-content-link").toggle()
    $(".dropdown-arrow-link").toggle()
  $("html").click ->
    $(".dropdown-content-link").hide()
    $(".dropdown-arrow-link").hide()
