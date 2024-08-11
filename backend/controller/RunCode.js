
const {runC,runCpp,runPython,runJava,runJs} = require('./Compile')

const runCode = async (language, code, fileName, input) => {
    try {
      
  
      let result;
     
      switch (language) {
        case '.c':
          
          result = await runC(fileName, language, input,code);
          break;
        case '.cpp':
          result = await runCpp(fileName, language, input,code);
          break;
        case '.py':
          result = await runPython(fileName, language, input,code);
          break;
        case '.java':
          result = await runJava(fileName, language, input,code);
          break;
        case '.js':
          result = await runJs(fileName, language, input,code);
          break;
        default:
          throw new Error('Unsupported language');
      }
      
      return result;
    } catch (error) {
      console.error('Error creating or running file:', error);
      throw error;
    }
  };

  module.exports = runCode;