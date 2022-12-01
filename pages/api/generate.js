import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `Name: Tyler the Explosives Expert
Lore: With a love of big bombs and short fuses, the gnome Ziggs is an explosive force of nature. As an inventor's assistant in Sparta, he was bored by his predictable life and befriended a mad, green-haired bomber named Nat. After a wild night on the town, Tyler took her advice and moved to Athens, where he now explores his fascinations more freely, terrorizing the chem-barons and regular citizens alike in his never ending quest to blow stuff up.

Name: Liliia the Banished Witch
Lore: Liliia was born to a noble family in Siampi, but she was always different. She was fascinated by dark magic, and even as a child, she would sneak into her father's library to read forbidden texts. When her family discovered her talents, they quickly arranged a marriage for her to a wealthy lord. But Liliia was not content with a life of luxury. She wanted more, and so she turned to the dark arts. Liliia's experiments with black magic caught the attention of the Siampian authorities, and she was soon banished from the city. Undeterred, she set up a new laboratory in the wilderness, where she continues to explore the dark arts. Liliia is a master of curses and hexes, and she takes a sadistic pleasure in using her powers to torment her enemies.

Name: G-Van, the Software Developer
Lore: G-van was born in Siampi, and he's always been fascinated by technology. He was a gifted student, and he quickly learned how to code and develop software. G-van's dream is to create the perfect artificial intelligence, and he's been working on a secret project to do just that. G-van is a brilliant programmer, but he's also a bit of a social outcast. He's not interested in the same things as other people, and he's always been more comfortable around machines than people. But G-van is about to make a breakthrough in his work, and he's going to change the world.

Name: `;

const generateAction = async (req, res) => {
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`);
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  const basePromptOutput = baseCompletion.data.choices.pop();
  const temp = basePromptOutput.text.trim();
  let name = req.body.userInput;
  const myArray = basePromptOutput.text.split("Lore: ");
  if (!temp.startsWith("Lore: ")) {
    name = name + myArray.shift().trim();
  }
  let lore = myArray.pop().trim();

  // I build Prompt #2.
  const secondPrompt = lore + "\n";
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.9,
    // I also increase max_tokens.
    max_tokens: 1250,
  });
  lore += secondPromptCompletion.data.choices.pop().text.trim();
  res.status(200).json({ output: basePromptOutput, name: name, lore: lore });
};

export default generateAction;
