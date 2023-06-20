const readline = require('readline');
const reviews = require('./reviews.js');
const places = require('./places.js');
const plRatings = require('./plRatings.js');

const scripts = [
  { name: 'reviews', module: reviews },
  { name: 'places', module: places },
  { name: 'plRatings', module: plRatings }
];

// Function to prompt user input
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runScripts() {
  try {

    const startFromBeginning = await promptUser(
      'Select an option:\n1: Start from the beginning\n2: Choose a script to start from\n'
    );

    let startIndex = 0;
    if (startFromBeginning === '2') {
      const scriptChoice = await promptUser(
        'Select a script to start from:\n1: reviews\n2: places\n3: plRatings\n'
      );
      startIndex = parseInt(scriptChoice) - 1;
    }

    for (let i = startIndex; i < scripts.length; i++) {
      const { name, module } = scripts[i];

      console.log('\n');

      console.log('started script ' + name);
      const closeConn = i + 1 === scripts.length
      await module.runScript(closeConn);

      console.log('\n');

      const continueChoice = await promptUser('Press Enter to continue, or type "exit" to quit...');
      if (continueChoice.toLowerCase() === 'exit') {
        break;
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

runScripts().catch(error => {
  console.error('Error occurred:', error);
  process.exit(1);
});
