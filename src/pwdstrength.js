
function passwordStrength(password){

    let score = 0;
    let re_num = new RegExp(/.*[1234567890].*/);
    let re_caps = new RegExp(/([A-Z].*[a-z].*)|([a-z].*[A-Z].*)/);
    let re_specials = new RegExp(/.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~].*/);
    
    if(password.length <= 4){
        score = 0;
        // console.log(`Too Weak: ${score}`);
        return score;
    }

    if(password.length <=8 ){
        score = 0;
        
        score = password.search(re_num)>=0 ? score+1: score;
        score = password.search(re_caps)>=0 ? score+1: score;
        score = password.search(re_specials)>=0 ? score+1: score;
        if(score == 0){
            // console.log(`Too weak: ${score}`);
            return 'Too weak';

        }
        if(score == 1){
            // console.log(`Weak: ${score}`);
            return 'Weak';
        }
        if(score ==2 || score == 3){
            // console.log(`Medium: ${score}`);
            return 'Medium';
        }
        if(score == 3 && password.length>=7){
            // console.log(`Strong: ${score}`);
            return 'Strong';
        }

    }

    if(password.length <= 11 ){
        score = 1;
        
        score = password.search(re_num)>=0 ? score+1: score;
        score = password.search(re_caps)>=0 ? score+1: score;
        score = password.search(re_specials)>=0 ? score+1: score;
        if(score > 2 ){
            // console.log(`Strong: ${score}`);
            return 'Strong';
        }
        // console.log(`Medium: ${score}`);
        return 'Medium';
    }

    if(password.length < 13){
        score=2;
        
        score = password.search(re_num)>=0 ? score+1: score;
        score = password.search(re_caps)>=0 ? score+1: score;
        score = password.search(re_specials)>=0 ? score+1: score;
        if(score>2){
            // console.log(`Strong: ${score}`);
            return 'Strong';
        }
        // console.log(`Medium: ${score}`);
        return 'Medium';
    }

    if(password.length >= 13)
    {
        score=4;
        // console.log(`Strong: ${score}`);
        return 'Strong';
    }
    
}

module.exports = passwordStrength;