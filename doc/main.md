In this type of implementation we can't use cookie or session and i need username to fetch
user AES key in the server
so i decided to send any encrypted data plus user username

**request**

```
{
    username: USERNAME
    data: ENCRYPTED_DATA
}
```