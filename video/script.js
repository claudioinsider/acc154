/* ============================================================
   VSL — scripts
   1. Data dinâmica do header
   2. Contador "pessoas assistindo agora"
   3. Gate: libera a oferta após o pitch do vídeo
   ============================================================ */

/* Executa fn quando o DOM estiver pronto (mesmo se já estiver) */
function onReady(fn) {
  if (document.readyState !== "loading") {
    fn()
  } else {
    document.addEventListener("DOMContentLoaded", fn)
  }
}

/* ---------- 1. Data dinâmica ---------- */
;(function () {
  var el = document.getElementById("advDateEl2")
  if (!el) return
  var d = new Date()
  var months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]
  el.innerHTML =
    months[d.getMonth()] +
    " " +
    d.getDate() +
    ", " +
    d.getFullYear() +
    ' <span class="adv-chevron">&#8964;</span>'
})()

/* ---------- 2. Contador "pessoas assistindo agora" ---------- */
;(function () {
  var el = document.getElementById("nswatchCount")
  if (!el) return

  var current = Math.floor(Math.random() * 140) + 180
  el.textContent = current

  function tick() {
    var change =
      (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 3) + 1)
    current += change
    if (current < 150) current = 150 + Math.floor(Math.random() * 20)
    if (current > 350) current = 320 + Math.floor(Math.random() * 20)
    el.textContent = current
    setTimeout(tick, 4000 + Math.random() * 5000)
  }
  setTimeout(tick, 3000)
})()

/* ---------- 3. Gate: libera a oferta após o pitch do vídeo ---------- */
onReady(function () {
  var SECONDS_TO_REVEAL_OFFER = 5 // segundos de vídeo até liberar a oferta
  // var SECONDS_TO_REVEAL_OFFER = 2725
  var alreadyShownKey = "offerAlreadyDisplayed"
  var revealed = false // trava: "timeupdate" dispara várias vezes por segundo

  function showOffer(scroll) {
    if (revealed) return
    revealed = true

    var blocks = document.querySelectorAll(".after-quiz")
    if (!blocks.length) return
    blocks.forEach(function (el) {
      el.style.display = "block"
    })
    localStorage.setItem(alreadyShownKey, "true")

    if (scroll) {
      var target = document.getElementById("products")
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  function watchVideoProgress() {
    var attempts = 0
    var checkInterval = setInterval(function () {
      if (
        typeof smartplayer === "undefined" ||
        !(smartplayer.instances && smartplayer.instances.length)
      ) {
        attempts++
        if (attempts >= 30) clearInterval(checkInterval)
        return
      }
      clearInterval(checkInterval)
      smartplayer.instances[0].on("timeupdate", function () {
        if (
          smartplayer.instances[0].video.currentTime >= SECONDS_TO_REVEAL_OFFER
        ) {
          showOffer(true)
        }
      })
    }, 1000)
  }

  // Quem já passou do pitch numa visita anterior vê a oferta direto (sem scroll forçado)
  if (localStorage.getItem(alreadyShownKey) === "true") {
    showOffer(false)
  } else {
    watchVideoProgress()
  }
})
