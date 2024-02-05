export default function codeRandomGenerate(length){

    const charset = '0123456789';
    // const charset2 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor((Math.random() * 10) % 10);

        code += charset[randomIndex];
        console.log("code = " + code + "randomIndex = " + randomIndex);
    }
    return code;
}