
const { Configuration, OpenAIApi } = require("openai");


// Env vars
const API_KEY_VALUE = process.env.API_KEY_VALUE

const configuration = new Configuration({
    apiKey: API_KEY_VALUE,
  });
  const openai = new OpenAIApi(configuration);

  const getAIValue = async (data) => {
    try {
      const completion = await openai.createCompletion("text-davinci-002", {
          prompt: data,
          temperature: 0.8,
          max_tokens: 842,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
        });
       return  {suggestion: completion.data.choices[0].text};
    } catch (error) {
    }
  };

  exports.getAIValue = getAIValue;
