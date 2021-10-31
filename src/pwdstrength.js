let obj = {}

function passwordStrength(password){

    let score = 0;
    let re_num = new RegExp(/.*[1234567890].*/);
    let re_caps = new RegExp(/([A-Z].*[a-z].*)|([a-z].*[A-Z].*)/);
    let re_specials = new RegExp(/.*[`! @#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/);
    
    if(password.length <= 4){
        score = 0;
        // console.log(`Too Weak: ${score}`);
        obj.strength = 'Too weak';
        obj.score = 0;
        return obj;
    }

    if(password.length <=8 ){
        score = 0;
        
        score = password.search(re_num)>=0 ? score+1: score;
        score = password.search(re_caps)>=0 ? score+1: score;
        score = password.search(re_specials)>=0 ? score+1: score;
        if(score == 0){
            // console.log(`Too weak: ${score}`);
            obj.strength = 'Too weak';
            obj.score = 0;
            return obj;
        }
        if(score == 1){
            // console.log(`Weak: ${score}`);
            obj.strength = 'Weak';
            obj.score = 1;
            return obj;

        }
        if(score ==2 || score == 3){
            // console.log(`Medium: ${score}`);
            obj.strength = 'Medium';
            obj.score = 2;
            return obj;

        }
        if(score == 3 && password.length>=7){
            // console.log(`Strong: ${score}`);
            obj.strength = 'Strong';
            obj.score = 3;
            return obj;
        }

    }

    if(password.length <= 11 ){
        score = 1;
        
        score = password.search(re_num)>=0 ? score+1: score;
        score = password.search(re_caps)>=0 ? score+1: score;
        score = password.search(re_specials)>=0 ? score+1: score;
        if(score > 2 ){
            // console.log(`Strong: ${score}`);
            obj.strength = 'Strong';
            obj.score = 3;
            return obj;
        }
        // console.log(`Medium: ${score}`);
        obj.strength = 'Medium';
        obj.score = 2;
        return obj;
    }

    if(password.length < 13){
        score=2;
        
        score = password.search(re_num)>=0 ? score+1: score;
        score = password.search(re_caps)>=0 ? score+1: score;
        score = password.search(re_specials)>=0 ? score+1: score;
        if(score>2){
            // console.log(`Strong: ${score}`);
            obj.strength = 'Strong';
            obj.score = 3;
            return obj;
        }
        // console.log(`Medium: ${score}`);
        obj.strength = 'Medium';
        obj.score = 2;
        return obj;
    }

    if(password.length >= 13)
    {
        score=4;
        // console.log(`Strong: ${score}`);
        obj.strength = 'Strong';
        obj.score = 3;
        return obj;
    }
    
}

module.exports = passwordStrength;