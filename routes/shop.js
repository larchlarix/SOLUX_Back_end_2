var router = require('express').Router();

//특정 라우터파일에 미들웨어를 적용하고 싶으면 =>로그인했니 참고

/*
function 로그인했니(req,res,next){
    if(req.user){
        next()
    }else{
        res.send('로그인안하셨는데요?')
    }
}

router.get('/shirts',로그인했니, function(req,res){
    res.send('셔츠 파는 페이지입니다.');
});
*/

function 로그인했니(req,res,next){
    if(req.user){
        next()
    }else{
        res.send('로그인안하셨는데요?')
    }
}

//모든 라우터에 미들웨어 적용하고 싶으면
router.use(로그인했니);

//내가원하는 라우터에만
//router.use('/shirts',로그인했니);

router.get('/shirts', function(req,res){
    res.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', function(req,res){
    res.send('바지 파는 페이지입니다.');
});

module.exports = router;