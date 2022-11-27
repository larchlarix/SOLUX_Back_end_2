//서버 오픈하는 기본 셋팅
const express = require('express'); //아까 설치한 express 라이브러리를 첨부해주세요.
const app = express(); // 첨부한 라이브러리를 이용해서 객체를 만들어주세요.

const bodyParser = require('body-parser'); //설치한 body-parser라는 라이브러리 첨부
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
app.set('view engine','ejs')

app.use('/public', express.static('public'));

var db;

MongoClient.connect('mongodb+srv://aputlarch:luvnaicndal21@cluster0.fy0db5u.mongodb.net/?retryWrites=true&w=majority',
function(error,client){
    if(error){return console.log(error)}
    
    db=client.db('todoapp'); //todooapp이라는 db 폴더에 연결


    //저장할 데이터 형식: 오브젝트 => {이름 : ' ', 나이 : 숫자}
    //자료저장시 _id꼭 적어야함 안적으면 강제로 하나 부여해줌
    db.collection('post').insertOne({이름: 'kmj', _id:100, 나이 : 24}, function(error, result){
        console.log('저장완료');
    });

    app.listen(8080, function(){
        console.log('listening on 8080')
    
    }); 
})


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
    res.render(__dirname + '/index.html');
});
// 이렇게 경로에 /만 있으면 홈페이지이다.

app.get('/write', function(req,res){
    res.render(__dirname + '/write.html');
});

/*어떤 사람이 /add 경로로 post 요청을 하면...
??를 해주세요

app.post('/경로', function(req,res){
    응답.send('전송완료')
})
*/

app.post('/add', function(req,res){
    res.send('전송완료');
    db.collection('counter').findOne({name:'게시물갯수'},function(error,result){
        console.log(result.totalPost);
        var 총게시물갯수 = result.totalPost;

        db.collection('post').insertOne({_id: 총게시물갯수 + 1,제목 : req.body.title, 날짜 : req.body.date}, function(error,result){
            console.log('저장완료');

            //counter 안 totalPost도 1증가시키자
            db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1}},
            function(error,result){
                if(error){return console.log(error);}

            });
    });

    // $set : 오퍼레이터 연산자, 바꿔주세요라는 요청
    //$inc : 증가시켜주세요

    //console.log(req.body.title);
    //console.log(req.body.date);

   
    });
});
//auto increment 자동으로 1증가 시켜서 저장하는 그런거

//list 로 get 요청으로 접속하면 
//실제 db에 저장된 데이터들로 예쁘게 꾸며진 html 보여줌
app.get('/list', function(req,res){
    
    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        res.render('list.ejs',{posts: result});  //db에서 자료 찾아주세요 + 찾은걸 ejs 파일에 집어넣어주세요
    });

});

app.delete('/delete', function(req,res){
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(error,result){
        console.log('삭제완료');
        res.status(200).send({message : '성공했습니다'});
    });
});

app.get('/detail/:id',function(req,res){
    db.collection('post').findOne({_id:parseInt(req.params.id)},function(error,result){
        console.log(result);
        res.render('detail.ejs',{data : result});
    });
    
});