//서버 오픈하는 기본 셋팅
const express = require('express'); //아까 설치한 express 라이브러리를 첨부해주세요.
const app = express(); // 첨부한 라이브러리를 이용해서 객체를 만들어주세요.

const bodyParser = require('body-parser'); //설치한 body-parser라는 라이브러리 첨부
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine','ejs');

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
    res.render('index.ejs');
});
// 이렇게 경로에 /만 있으면 홈페이지이다.

app.get('/write', function(req,res){
    res.render( 'write.ejs');
});

/*어떤 사람이 /add 경로로 post 요청을 하면...
??를 해주세요

app.post('/경로', function(req,res){
    응답.send('전송완료')
})
*/


//auto increment 자동으로 1증가 시켜서 저장하는 그런거

//list 로 get 요청으로 접속하면 
//실제 db에 저장된 데이터들로 예쁘게 꾸며진 html 보여줌
app.get('/list', function(req,res){
    
    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        res.render('list.ejs',{posts: result});  //db에서 자료 찾아주세요 + 찾은걸 ejs 파일에 집어넣어주세요
    });

});

app.get('/search', (req, res)=>{
    var 검색조건=[
        {
            $search : {
                index: 'titleSearch',
                text:{
                    query:req.query.value,
                    path:'제목'//제목,날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
            }
        }
        /*
        { $sort : {_id :1}},
        { $limit : 10},
        { $project : {제목:1, _id:0, score:{ $meta: "searchScore"}}}
        */
    ]
    db.collection('post').aggregate(검색조건).toArray((error, result)=>{
        console.log(result)
        res.render('search.ejs',{posts:result})
    })
})




app.get('/detail/:id',function(req,res){
    db.collection('post').findOne({_id:parseInt(req.params.id)},function(error,result){
        console.log(result);
        res.render('detail.ejs',{data : result});
    });
    
});

app.get('/edit/:id',function(req,res){

    db.collection('post').findOne({_id:parseInt(req.params.id)},function(error,result){
     console.log(result)
     res.render('edit.ejs', {post:result})
    })
   
})
app.put('/edit', function(req,res){
    db.collection('post').updateOne({_id:parseInt(req.body.id)},{$set: {제목:req.body.title, 날짜:req.body.date}},function(error, result){
       console.log('수정완료')
       res.redirect('/list')
    })
});


//session 방식 로그인 기능
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',function(req,res){
  res.render('login.ejs')

});
app.post('/login',passport.authenticate('local',{
    failureRedirect:'/fail'
}),function(req,res){
    res.redirect('/')
});

app.get('/mypage',로그인했니, function(req,res){
    console.log(req.user);
    res.render('mypage.ejs', {사용자: req.user})
    });
    
    function 로그인했니(req,res,next){
        if(req.user){
            next()
        }else{
            res.send('로그인안하셨는데요?')
        }
    }

passport.use(new LocalStrategy({
    usernameField:'id',
    passwordField: 'pw',
    session : true,  // 세션으로 저장할 것인지 참 , 거짓으로
    passReqToCallback : false,  //다른 정보 검증시 참, 거짓으로
}, 
//아이디, 비번 db와 검증하는 부분
function(입력한아이디, 입력한비번, done){
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({id: 입력한아이디}, function(error, result){
        if(error) return done(error)
        if(!result) return done(null , false, {message : '존재하지 않는 아이디요'})
        if(입력한비번 == result.pw){
            return done(null, result)
        } else{
            return done(null, false, {message : ' 비번틀렸어요'})
        }
    })
}));

passport.serializeUser(function(user, done){
    done(null,user.id)
});

//로그인한 유저의 개인정보를 DB에서 찾는 역할
passport.deserializeUser(function(아이디,done){
    db.collection('login').findOne({id:아이디}, function(error, result){
        done(null,result)
    })
    
});


app.post('/register',function(req,res){

    db.collection('login').insertOne({id:req.body.id, pw:req.body.pw}, function(error,result){
        res.redirect('/')
    })
})

app.post('/add', function(req,res){
    res.send('전송완료');
    db.collection('counter').findOne({name:'게시물갯수'},function(error,result){
        console.log(result.totalPost);
        var 총게시물갯수 = result.totalPost;
        var 저장할거 ={_id: 총게시물갯수 + 1, 작성자: req.user._id,제목 : req.body.title, 날짜 : req.body.date}

        db.collection('post').insertOne(저장할거, function(error,result){
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

app.delete('/delete', function(req,res){
    console.log('삭제요청들어옴');
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    var 삭제할데이터 ={_id:req.body._id, 작성자:req.user._id};

    db.collection('post').deleteOne(삭제할데이터, function(error,result){
        console.log('삭제완료');
        if(result){console.log(result)};
        res.status(200).send({message : '성공했습니다'});
    });
});
/*
app.get('/shop/shirts', function(req,res){
    res.send('셔츠 파는 페이지입니다.');
});

app.get('/shop/pants', function(req,res){
    res.send('바지 파는 페이지입니다.');
});
*/

//server.js에 shop.js첨부하기
// '/어쩌구'경로로 접속한 거에만 이 미들웨어 적용
app.use('/shop', require('./routes/shop.js'));
app.use('/board/sub', require('./routes/board.js'));



let multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, './public/image')
    },
    filename:function(req,file, cb){
        cb(null,file.originalname)
    }
});


var upload = multer({storage : storage});

app.get('/upload', function(req,res){
    res.render('upload.ejs')
})

app.post('/upload',upload.single('profile'),function(req,res){
    res.send('업로드완료')
});

app.get('/image/:imageName', function(req,res){
    res.sendFile(__dirname +'/public/image/'+req.params.imageName)
})

