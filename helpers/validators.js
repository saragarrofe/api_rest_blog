const validator = require ("validator");

const validate = (params) => {

    let validateTitle = !validator.isEmpty(params.title) &&
        validator.isLength(params.title, { min: 5, max: undefined });
    let validateContent = !validator.isEmpty(params.content);

    if (!validateTitle || !validateContent) {
        throw new Error("No se ha podido validar la información");
    }


}


module.exports = {
    validate
}