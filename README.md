# tweet-data-analyser

<h2>Description</h2>
Command line analyser for twitter data.

<h2>Purpose</h2>
Developed by Markus Uusitalo for the purposes of conducting specific Twitter research related to an assignment on a research methodology course (TTA-15091-2020-2021-1 Tutkimusmetodologia) in Tampere University.

<h2>Requirements</h2>
Node.js

<h2>How to use?</h2>
<ol>
<li>Clone the repository</li>
<li>Open the installation folder</li>
<li>run npm install</li>
<li>rename example.env -> .env</li>
<li>Optionally change configurations in .env file</li>
<li>npm run start</li>
</ol>

example.env contains example configurations and assets/example.csv contains an example input file.
To analyse a different .csv-dataset, put it into the assets folder and set the input file in the .env file to point to it.

<h2>Resources</h2>
The dataset by Kaggle user alaix14 we analyzed as part of the assignment: https://www.kaggle.com/alaix14/bitcoin-tweets-20160101-to-20190329
The program works on any dataset that conforms to the same syntax. Delimiter can be changed from .env
