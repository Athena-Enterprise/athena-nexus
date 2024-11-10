# Bot Commands Documentation

## /ping
- **Description**: Returns the bot's latency with a fun response.
- **Example**:
  ```javascript
  interaction.reply('Pinging...').then(sent => {
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
  });
