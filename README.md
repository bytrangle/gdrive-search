# A CLI App to Search Your Google Drive Files

## How to Use

### Authorization

To search for files in your Google Drive, this app needs to get your permission to access them.

After installation, run `godri authorize` to grant your permission. You only need to do this step once.

Your tokens will be stored in `$HOME/.config/congigstore/godri.json` and has the following parameters:

```
{
    "tokens": {
        "access_token": "XXXXXXXXXX",
        "refresh_token": "XXXXXXXXXX",
        "scope": "https://www.googleapis.com/auth/drive.metadata.readonly",
        "token_type": "Bearer",
        "expiry_date": 1234567890
    },
    "user": {
        "displayName": "Jane Doe",
        "emailAddress": "jane.doe@me.net"
    }
}
```

### Search

Once you've authorized with Godri, you can start searching for your Google Drive files with `godri search <keyword> [options]`.

The keyword is compulsory. If you want to use multi-word, please wrap them in single quote, like so: `godri search 'finance tracker'`.

Accepted options are:

- --file-type, -f: Specify the file types. Accepted formats are `sheets`, `docs`, `forms` and `slides`.
- --owned, -o: Restrict the search results to files that you owned only.
- --name-only, -n: Restrict the search range to files whose only file names match your provided keyword.
