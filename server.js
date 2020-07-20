var express = require("express");
var fs = require("fs");
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

function loadNotes() {
    var notes = JSON.parse( fs.readFileSync( './db/db.json', 'utf8' ) )
    return notes;
}

var noteList = loadNotes();


app.get("/api/notes", function(req, res) {
    console.log(`[GET /api/notes]`)
    res.send(noteList);
});

function saveNotes() {
    var notesJSON = JSON.stringify(noteList);
    fs.writeFileSync ("./db/db.json", notesJSON);
};

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    newNote.id = Date.now()
    console.log(`[POST/api/notes]`, newNote);

    noteList.push(newNote);
    saveNotes();

    res.send(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
    const noteId = req.params.id

    noteList = noteList.filter( note=> note.id != noteId)
    
    saveNotes()

    console.log(`[DELETE/api/notes]`)
    res.send({id: noteId, message: `Delete successful ${noteId}`, status: true})
})

app.listen (PORT, function() {
    console.log("App listening on PORT: " + PORT);
});