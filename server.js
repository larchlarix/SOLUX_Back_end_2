//서버 오픈하는 기본 셋팅
const express = require('express'); //아까 설치한 express 라이브러리를 첨부해주세요.
const app = express(); // 첨부한 라이브러리를 이용해서 객체를 만들어주세요.

const bodyParser = require('body-parser'); //설치한 body-parser라는 라이브러리 첨부
app.use(bodyParser.urlencoded({extended : true}));

app.listen(8080, function(){
    console.log('listening on 8080')

}); 
/*
함수, 우리의 컴퓨터에 서버를 열수가 있음
listen(8080=서버띄울 포트번호,띄운 후 실행할 코드)
8080포트로 웹서버를 열고, 잘 열리면 listening on 8080을 터미널에 출력해주세요.
*/

/*누군가가 /pet으로 방문을 하면
pet관련된 안내문을 띄워주자*/

app.get('/pet', function(req,res){
res.send('펫 용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function(req,res){
    res.send('뷰티 용품 쇼핑할 수 있는 페이지입니다.');
    });

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});
// 이렇게 경로에 /만 있으면 홈페이지이다.

app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html');
});

/*어떤 사람이 /add 경로로 post 요청을 하면...
??를 해주세요

app.post('/경로', function(req,res){
    응답.send('전송완료')
})
*/

app.post('/add', function(req,res){
    res.send('전송완료');
    console.log(req.body.title);
    console.log(req.body.date);
    

});