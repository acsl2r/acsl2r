export function handleError(error: string | Error)
{
  !!error ? alert(error.toString()) : alert("Unknown error");
}
