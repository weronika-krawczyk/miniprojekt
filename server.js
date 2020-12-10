//zmienne, stałe
var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

// app.get("/", function (req, res) {
//     res.send("<h1>first app on heroku!</h1>")
// })

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

// var express = require("express")
// var app = express()
// const PORT = 3000;

var path = require("path")

var users = [{ id: 1, login: "Ania", password: "ania", wiek: 10, uczen: "tak", plec: "K" },
{ id: 2, login: "Basia", password: "basia", wiek: 16, uczen: "tak", plec: "K" },
{ id: 3, login: "Czarek", password: "czarek", wiek: 21, uczen: "nie", plec: "M" },
{ id: 4, login: "Damian", password: "damian", wiek: 15, uczen: "tak", plec: "M" },
{ id: 4, login: "Ewa", password: "ewa", wiek: 11, uczen: "tak", plec: "K" },
{ id: 4, login: "Franek", password: "franek", wiek: 19, uczen: "nie", plec: "M" },
{ id: 4, login: "Grażyna", password: "grażyna", wiek: 20, uczen: "nie", plec: "K" }]

var side = "<style>body {margin: 0px;padding: 0px;background-color: #212121;color: white;} table {margin-top: 10px; margin-left: 10px;border: 5px solid lightgrey;border-collapse: collapse;width: 80%;padding-left: 20px;font-size: 30px;}td{border-collapse: collapse; border: 5px solid lightgrey;}  #naglowek2 {height: 45px; width: 100%; background-color: #ffe334; padding-top: 15px;margin-bottom:10px;} a {color: white;font-size: 25px;padding: 5px;}</style></div><div id='naglowek2'><a href='http://localhost:3000/sort'>Sort</a><a href='http://localhost:3000/gender'>Gender</a><a href='http://localhost:3000/show'>Show</a><a href='http://localhost:3000/admin'>Admin</a></div></body>"

var zalogowani = []

app.get("/rejestracja", function (req, res) {
    loginy = []
    for (i = 0; i < users.length; i++) {
        loginy.push(users[i].login)
    }
    sprawdzenie = loginy.indexOf(req.query.login)
    if (sprawdzenie === -1) {
        if (req.query.uczen == undefined) {
            req.query.uczen = "nie"
        }
        users.push({ id: (users.length) + 1, login: req.query.login, password: req.query.password, wiek: req.query.wiek, uczen: req.query.uczen, plec: req.query.plec })
        res.send("Witaj " + req.query.login + ". Twoje konto zostało dodane")
    }
    else {
        res.send("Taki użytkownik jak:  " + req.query.login + " już istnieje. Wróć do strony rejestracji i spróbuj ponownie.")
    }

})

app.get("/logowanie", function (req, res) {
    console.log(req.query.login, req.query.password)
    loginy = []
    hasla = []
    for (i = 0; i < users.length; i++) {
        loginy.push(users[i].login)
        hasla.push(users[i].password)
    }
    l = loginy.indexOf(req.query.login)
    h = hasla.indexOf(req.query.password)
    if (l === -1) {
        res.send("Nie ma takiego użytkownika jak: " + req.query.login)
    }
    if (l == h) {
        res.redirect("/admin")
        zalogowani.push(req.query.login)
    }
    if (l !== h) {
        res.send("Niestety, błędny login lub hasło ")
    }
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/main.html"))

})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/register.html"))
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/login.html"))
})
app.get("/logout", function (req, res) {
    zalogowani = []
    res.redirect("/admin")
})

app.get("/admin", function (req, res) {
    if (zalogowani.length == 0) {
        res.sendFile(path.join(__dirname + "/admin.html"))
    }
    else {
        res.sendFile(path.join(__dirname + "/admin_logged.html"))
    }
})
app.get("/sortowanie", function (req, res) {
    if (req.query.value == "rosnaco") {
        sort = true
    } else {
        sort = false
    }
    res.redirect("/sort")
})
sort = true
app.get("/sort", function (req, res) {
    if (zalogowani.length == 0) {
        res.redirect("/admin")
    }
    else {
        res.sendFile(path.join(__dirname + "/sort.html"))
        sort_Page = "<form action=\"/sortowanie\" method=\"GET\">"
        if (sort == true) {
            sort_Page += "<input type=\"radio\" value=\"rosnaco\" name=\"value\" onchange=\"this.form.submit()\"checked> rosnaco <input type=\"radio\" value=\"malejaco\" name=\"value\"onchange=\"this.form.submit()\"> malejaco </form><table>"
            users.sort(function (a, b) { return a.wiek - b.wiek; });
            for (i = 0; i < users.length; i++) {
                wiersz = "<tr><td>" + "Id: " + users[i].id + "</td>" + "<td>" + "User: " + users[i].login + " - " + users[i].password + "</td>" + "<td>" + "Wiek: " + users[i].wiek + "</td>" + "</tr>"
                sort_Page += wiersz
            }
        }

        else {
            sort_Page += "<input type=\"radio\" value=\"rosnaco\" name=\"value\" onchange=\"this.form.submit()\">rosnaco<input type=\"radio\" value=\"malejaco\" name=\"value\"onchange=\"this.form.submit()\"checked>malejaco</form>"
            sort_Page += "<table class=\"line\">"
            users.sort(function (a, b) { return b.wiek - a.wiek; });
            for (i = 0; i < users.length; i++) {
                wiersz = "<tr><td>" + "Id: " + users[i].id + "</td>" + "<td>" + "User: " + users[i].login + " - " + users[i].password + "</td>" + "<td>" + "Wiek: " + users[i].wiek + "</td>" + "</tr>"
                sort_Page += wiersz
            }
        }
        res.send(side + sort_Page + "</table>")
    }
})

app.get("/sortowanie", function (req, res) {
    if (req.query.value == "rosnaco") {
        sort = true
    } else {
        sort = false
    }
    res.redirect("/sort")
})

app.get("/gender", function (req, res) {
    if (zalogowani.length == 0) {
        res.redirect("/admin")
    }
    else {
        gender_k = ""
        gender_m = ""
        tabela = "<table>"
        mezczyzni = []
        kobiety = []
        for (i = 0; i < users.length; i++) {
            if (users[i].plec == "K") {
                kobiety.push({ id: users[i].id, plec: users[i].plec })
            }
            else {
                mezczyzni.push({ id: users[i].id, plec: users[i].plec })
            }
        }
        console.log(kobiety, mezczyzni)
        for (i = 0; i < kobiety.length; i++) {
            wiersz = "<tr><td>" + "Id: " + kobiety[i].id + "</td>" + "<td>" + "Płeć: " + kobiety[i].plec + "</td></tr>"
            gender_k += wiersz
        }
        for (i = 0; i < mezczyzni.length; i++) {
            wiersz = "<tr><td>" + "Id: " + mezczyzni[i].id + "</td>" + "<td>" + "Płeć: " + mezczyzni[i].plec + "</td></tr>"
            gender_m += wiersz
        }

        res.send(side + tabela + gender_k + "</table>" + tabela + gender_m + "</table>")
    }
})

app.get("/show", function (req, res) {
    if (zalogowani.length == 0) {
        res.redirect("/admin")
    }
    else {
        show = ""
        tabela = "<table>"
        for (i = 0; i < users.length; i++) {
            wiersz = "<tr><td>" + "Id: " + users[i].id + "</td>" + "<td>" + "User: " + users[i].login + " - " + users[i].password + "</td>" + "<td>" + "Wiek: " + users[i].wiek + "</td>" + "<td>" + "Uczeń: " + users[i].uczen + "</td>" + "<td>" + "Płeć: " + users[i].plec + "</td></tr>"
            show += wiersz
        }
        res.send(side + tabela + show + "</table>")
    }
})

