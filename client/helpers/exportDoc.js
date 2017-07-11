import fs from 'fs';
import generateDocx from 'generate-docx';
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var path = require('path');

const generateDocument = (title, description, body) => {
  // const options = {
  //   template: {
  //     filePath: './exportDocTemplate.docx',
  //     data: {
  //       'title': title,
  //       'description': description,
  //       'body': body
  //     }
  //   }
  // };

  // generateDocx(options)
  // .then((buf) => {
  //   console.log('.................................................', buf);
  //   fs.writeFileSync('./frombuffer.docx', buf);
  //   console.log('File written');
  // })
  // .catch(error => console.error(error));
  //Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, 'exportDocTemplate.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData({
    title,
    description,
    body
});

try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({error: e}));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
}

var buf = doc.getZip()
             .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);
};

export default generateDocument;


