import React from 'react';
import { Empty } from 'antd';
import { AutoChart } from '@antv/auto-chart';
import { tsvParse, autoType, tsvParseRows } from 'd3-dsv';
import './Popup.css';

function getClipboard() {
  let result = '';
  const helperdiv = document.createElement("input");
  document.body.appendChild(helperdiv);
  helperdiv.contentEditable = true;
  helperdiv.focus();    

// read the clipboard contents from the helperdiv
  if (document.execCommand('paste')) {
      result = helperdiv.value;
  } else {
      console.error('failed to get clipboard content');
  }
  document.body.removeChild(helperdiv);
  return result;
}

function App() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let newData = [];
    const str = getClipboard().trim().replaceAll(' ', '\n');
    const rows = tsvParseRows(str, autoType);
    const fristRow = rows[0]?.filter(item => item !== null || item !== undefined);
    if (fristRow?.length) {
      if (fristRow?.every(item => !!item && typeof item === 'string')) {
        if (rows.length >= 1) {
          newData = tsvParse(str, autoType);
        }
      } else {
        const columnNum = fristRow.length;
        const fakeHeader = Array(columnNum).fill(0).map((item, index) => `field${index}`).join('\t');
        const newStr = fakeHeader + '\n' + str;

        newData = tsvParse(newStr, autoType);
      }
    }
    console.log(newData);
    setData(newData);
  }, []);

  if (!data?.length) {
    return (
      <div className="App">
        <Empty
          image="https://gw.alipayobjects.com/zos/basement_prod/9a59280d-8f23-4234-b5cf-02956a91b6ff.svg"
          imageStyle={{
            height: 60,
          }}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <AutoChart data={data} />
    </div>
  );
}

export default App;