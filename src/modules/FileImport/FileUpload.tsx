import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

const fileReader = new FileReader();

const App: React.FC = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const arrayResult = csvRows.map((i) => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object, header, index) => {
        // eslint-disable-next-line no-param-reassign
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(arrayResult);
  };
  const headerKeys = Object.keys(Object.assign({}, ...array));

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        // csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };
  const props: UploadProps = {
    accept: '.csv',
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        fileReader.onload = (e) => {
          const text = e.target.result;
          csvFileToArray(text);
        };
        fileReader.readAsText(info.file.originFileObj);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <table
        style={{ maxHeight: '300px', display: 'block', overflow: 'scroll' }}
      >
        <thead>
          <tr key={'header'}>
            {headerKeys.map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val: any, index) => (
                <td key={index}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
