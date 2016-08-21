# timeserver

a stream of values froma  timeserver

```js
let timeS = timeserver (interval, url)
```

polls `url` at `inteval`.

returns a kefir stream of

```js
{
  requestedAt: requestedAt,
  response: unixTime,
}
```

## license

BSD
