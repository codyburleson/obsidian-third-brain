import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources/chat/completions";
import ThirdBrainPlugin from "./main";
import { APIClient } from "openai/core";


const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "getCurrentWeather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            latitude: {
              type: "string",
            },
            longitude: {
              type: "string",
            },
          },
          required: ["longitude", "latitude"],
        },
      }
    },
    {
      type: "function",
      function: {
        name: "getLocation",
        description: "Get the user's location based on their IP address",
        parameters: {
          type: "object",
          properties: {},
        },
      }
    },
  ];
   
  
  type ToolFunction = (...args: any[]) => Promise<any>;
  
  const availableTools: { [key: string]: ToolFunction } = {
    getCurrentWeather,
    getLocation,
  };
  
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
  ];

export class TestAgent {

	plugin: ThirdBrainPlugin;

    openai: APIClient;
    
	constructor(plugin: ThirdBrainPlugin) {
		this.plugin = plugin;
        console.log('-- TestAgent() openAiApiKey: ', this.plugin.settings.openAiApiKey);
        this.openai = new OpenAI({
            apiKey: this.plugin.settings.openAiApiKey,
            dangerouslyAllowBrowser: true,
        });
	}

    async execute(userInput: string) {
        console.log('>> agent() userInput: ', userInput);
      messages.push({
        role: "user",
        content: userInput,
      });
     
      for (let i = 0; i < 5; i++) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: messages,
          tools: tools,
        });
     
        const { finish_reason, message } = response.choices[0];
     
        if (finish_reason === "tool_calls" && message.tool_calls) {
          const functionName = message.tool_calls[0].function.name;
          const functionToCall = availableTools[functionName];
          const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
          const functionArgsArr = Object.values(functionArgs);
          const functionResponse = await functionToCall.apply(
            null,
            functionArgsArr
          );
     
          messages.push({
            role: "function",
            name: functionName,
            content: `
                    The result of the last function was this: ${JSON.stringify(
                      functionResponse
                    )}
                    `,
          });
        } else if (finish_reason === "stop") {
          messages.push(message);
          return message.content;
        }
      }
      return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
    }

}
 
async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  const locationData = await response.json();
  return locationData;
}
 
async function getCurrentWeather(latitude: string, longitude: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}
 

 

 
