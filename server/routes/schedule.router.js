const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.post('/addDate', (req, res)=>{
    if (req.isAuthenticated()) {
        let newDate = req.body;
        pool.query('INSERT INTO date (date, location, unit_id) VALUES ($1, $2, $3);',
        [newDate.date, newDate.location, newDate.unit_id]
        ).then(function(res){
            res.sendStatus(500);
        }).catch(function(error) {
            res.sendStatus(201);
        })
    }else{
        res.sendStatus(403);
    }
});

router.get('/getDates/:unit', (req, res)=>{
    if (req.isAuthenticated()) {
        let search = req.params.unit;
        pool.query(`select * from date where unit_id = ${search};`)
        .then(function(result) {
            res.send(result.rows);
        }).catch(function(error) {
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
})

router.post('/genDoc', (req, res)=>{
    if (req.isAuthenticated()) {
        let newDoc = req.body;
        pool.query('INSERT INTO doc (handle, mimetype, original_path, url, upload_id, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [req.body.handle, req.body.mimetype, req.body.originalPath, req.body.url, req.body.uploadId, req.body.originalFile.name]
        ).then(function(res){
            res.send(result.rows);
            res.sendStatus(500);
        }).catch(function(error) {
            res.sendStatus(201);
        })
    }else{
        res.sendStatus(403);
    }
});

router.get('/genDoc/id/:doc_id', (req, res)=>{
    if (req.isAuthenticated()) {
        let search = req.params.doc_id;
        pool.query(`select * from doc where upload_id = $1;`,
        [search]
        ).then(function(result) {
            res.send(result);
        }).catch(function(error) {
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
});

router.post('/genDoc/join', (req, res)=>{
    if (req.isAuthenticated()) {
        let date_id = req.body.date_id;
        let doc_id = req.body.doc_id;
        pool.query('INSERT INTO date_doc (date_id, doc_id) VALUES ($1, $2);',
        [date_id, doc_id]
        ).then(function(res){
            res.sendStatus(500);
        }).catch(function(error) {
            res.sendStatus(201);
        })
    }else{
        res.sendStatus(403);
    }
});

router.get('/genDoc/all/:date_id', (req, res)=>{
    if (req.isAuthenticated()) {
        let search = req.params.date_id;
        pool.query(`select * from date_doc join doc on doc.id = date_doc.doc_id where date_id = $1;`,
        [search]
        ).then(function(result) {
            res.send(result.rows);
        }).catch(function(error) {
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
});

router.delete('/genDoc/delete/:doc_id', (req, res)=>{
    if (req.isAuthenticated()) {
        let id = req.params.doc_id;
        pool.query(`delete from doc where id = $1;`, [id])
        pool.query(`delete from date_doc where doc_id = $1;`, [id])
        .then(function(result) {
            res.send(result.rows);
        }).catch(function(error) {
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
})

router.delete('/date/delete/:id', (req, res)=>{
    if (req.isAuthenticated()) {
        let id = req.params.id;
        pool.query(`delete from date where id = $1;`, [id])
        .then(function(result) {
            res.send(result.rows);
        }).catch(function(error) {
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
})

module.exports = router;