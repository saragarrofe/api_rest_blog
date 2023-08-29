const validator = require("validator");
const Article = require("../models/Article")
const mongoose = require("mongoose")
const { validate } = require("../helpers/validators");
const fs = require ("fs");
const path = require ("path");



// Crear artículos 

const create = async (req, res) => {
  try {
    const params = req.body;

    const validateTitle = !validator.isEmpty(params.title) &&
      validator.isLength(params.title, { min: 5, max: undefined });
    const validateContent = !validator.isEmpty(params.content);

    if (!validateTitle || !validateContent) {
      return res.status(400).json({
        status: "Error",
        message: "Faltan datos"
      });
    }

    const article = new Article(params);
    const savedArticle = await article.save();

    return res.status(200).json({
      status: "Success",
      article: savedArticle,
      message: "Artículo creado con éxito"
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "No se ha guardado el artículo"
    });
  }
};





// Get todos los artículos
const getArticles = async (req, res) => {
     try {
          let articles = Article.find({})                        
           
            if (req.params.lasts){
                articles = articles.limit(3);
            }  

            articles = await articles.sort({date: -1})  
                               .exec();

            if (!articles || articles.length === 0) {
                return res.status(404).json({
                status: "Error",
                message: "No se ha encontrado ningún artículo"
                });
            }
        
          return res.status(200).json({
            status: "Success",
            counter: articles.length,
            articles
          });
        } catch (error) {
          return res.status(500).json({
            status: "Error",
            message: "Ha ocurrido un error al buscar los artículos"
          });
        }
      };

// Get un artículo mediante su ID
const getById = async (req, res) => {
        try {
            const id = req.params.id;
    
            const article = await Article.findById(id).exec();
    
            if (!article) {
                return res.status(404).json({
                    status: "Error",
                    message: "No se ha encontrado el artículo"
                });
            }
    
            return res.status(200).json({
                status: "Success",
                article
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: "Ha ocurrido un error al buscar el artículo"
            });
        }
    };
    
// Eliminar un artículo mediante su ID
const deleteByID = async (req, res) => {
        try {
          const id = req.params.id;
      
          const deleteArticle = await Article.findOneAndDelete({ _id: id });
      
          if (!deleteArticle) {
            return res.status(404).json({
              status: "Error",
              message: "No se ha encontrado el artículo para eliminar"
            });
          }
      
          return res.status(200).json({
            status: "Success",
            article: deleteArticle,
            message: "Artículo eliminado correctamente"
          });
        } catch (error) {
          return res.status(500).json({
            status: "Error",
            message: "Ha ocurrido un error al eliminar el artículo"
          });
        }
      };

// Actualizar un artículo
const update = async (req, res) => {
        try {
            const id = req.params.id;
            let params = req.body;
            await validate(params);
    
            const updatedArticle = await Article.findOneAndUpdate({ _id: id }, params, { new: true });
    
            if (!updatedArticle) {
                return res.status(404).json({
                    status: "Error",
                    message: "No se ha encontrado el artículo para editar"
                });
            }
    
            return res.status(200).json({
                status: "Success",
                article: updatedArticle,
                message: "Artículo editado correctamente"
            });
    
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: "Ha ocurrido un error al editar el artículo"
            });
        }
    };

// Subir una imagen
const uploadImage = async (req, res) => {
        if (!req.file && !req.files) {
          return res.status(404).json({
            status: "Error",
            message: "Archivo no válido",
          });
        }
      
        let fileName = req.file.originalname;
        let splitFile = fileName.split(".");
        let extension = splitFile[1];
      
        if (
          extension !== "png" &&
          extension !== "jpg" &&
          extension !== "jpeg" &&
          extension !== "gif"
        ) {
          fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
              status: "Error",
              message: "Imagen no válida",
            });
          });
        } else {
          try {
            const id = req.params.id;
            const updatedArticle = await Article.findOneAndUpdate(
              { _id: id },
              { image: req.file.filename }, 
              { new: true }
            );
      
            if (!updatedArticle) {
              return res.status(404).json({
                status: "Error",
                message: "No se ha encontrado el artículo para editar",
              });
            }
      
            return res.status(200).json({
              status: "Success",
              article: updatedArticle,
              message: "Artículo editado correctamente",
              req_file: req.file,
            });
          } catch (error) {
            return res.status(500).json({
              status: "Error",
              message: "Ha ocurrido un error al editar el artículo",
            });
          }
        }
      };

// Obtener una imagen
const image = async (req, res) => {
      try {
        const file = req.params.file;
        const filePath = path.join(__dirname, '..', 'images', file);
    
        res.sendFile(filePath, (error) => {
          if (error) {
            return res.status(404).json({
              status: "Error",
              message: "La imagen no existe",
              file,
              filePath
            });
          }
        });
      } catch (error) {
        return res.status(500).json({
          status: "Error",
          message: "Ha ocurrido un error al obtener la imagen"
        });
      }
    };
    

// Buscar un artículo en concreto mediante un filtro
    const search = async (req, res) => {
      try {
        const searching = req.params.search; 
    
        const findArticles = await Article.find({
          "$or": [
            { "title": { "$regex": searching, "$options": "i" } },
            { "content": { "$regex": searching, "$options": "i" } }
          ]
        })
        .sort({ date: -1 })
        .exec();
    
        if (!findArticles || findArticles.length === 0) {
          return res.status(404).json({
            status: "Error",
            message: "No se han encontrado artículos"
          });
        }
    
        return res.status(200).json({
          status: "Success",
          articles: findArticles
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: "Error",
          message: "Ha ocurrido un error al buscar los artículos",
          error: error.message
        });
      }
    };
    
    

 
    
    
    
      

  
module.exports = {
    create,
    getArticles, 
    getById,
    deleteByID, 
    update, 
    uploadImage,
    image,
    search
}