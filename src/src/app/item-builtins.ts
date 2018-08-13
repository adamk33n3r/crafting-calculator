export default [
  {
    id: 'redstone_dust',
    name: 'Redstone Dust',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAEt0lEQVR4Ae2dMY4WMQxG8yNuQLuip2BvQcN1OAfX4QR7AijoES1nAI1EGSn+HNnK7Pe2nLGT+PlptrBm/jH4gwAEIAABCEAAAhCAAAQgAAFfAg/X0j+O8be69h9j2PJ9Uw2X9T0JIJZn38urRqxyxJ4bIJZn38urRqxyxJ4bIJZn38urRqxyxJ4bIJZn38urRqxyxJ4bIJZn38urRqxyxJ4bIJZn38urflu+Q9MG6lD5U8+55EH3axlc88TqEcxuF8Sya3lPwYjVw9luF8Sya3lPwYjVw9luF8Sya3lPwYjVw9luF8Sya3lPwYjVw9luF8Sya3lPwYjVw9lulyNnherc7+rad7F1X8T4K/yXmPMkxv8Pl+aLp84WeWLlmk/WggBiLQBxO0cAsXLcyFoQQKwFIG7nCCBWjhtZCwKItQDE7RwBxMpxI2tBALEWgLidI4BYOW5kLQgg1gIQt3MEECvHjawFAcRaAOJ2jkDLV33VoXLTy6Q5YkLWTyE2G/o7kdgxuOaJlWgMKWsCiLVmRESCAGIloJGyJoBYa0ZEJAggVgIaKWsCiLVmRESCAGIloJGyJoBYa0ZEJAggVgIaKWsCiLVmRESCAGIloJGyJiC/sKrO/a4jvJbZ3xrnfsQfcQn1Rd1r+Wfx12Uzs0WeWGIjCY8RQKwYJ6JEAoglAiM8RgCxYpyIEgkglgiM8BgBxIpxIkokgFgiMMJjBBArxokokQBiicAIjxFArBgnokQCiCUCIzxGALFinIgSCTzUoXJm6Jn5QrFYh/xF4/fqBmOMr2LOZzH+1PDMS7E8sU7t5s3PhVg3b+Cpx0esUztz83Mh1s0beOrxEevUztz8XIh18waeenzEOrUzNz8XYt28gaceH7FO7czNz4VYN2/gqcdHrFM7c/NzybPCzMun6i+TZuZ4J/ah4+O26guuF6d3IixmhSIwwusI8K+wjq31yohl3f664hGrjq31yohl3f664hGrjq31yohl3f664hGrjq31yohl3f664hGrjq31yohl3f664hGrjq31yvJXkzOD1Q8iYvXF0Gv5jpdixTJawtWBcsuhxhg8sbpIm+2DWGYN7yoXsbpIm+2DWGYN7yoXsbpIm+2DWGYN7yoXsbpIm+2DWGYN7yoXsbpIm+2DWGYN7yoXsbpIm+3zUOtVP4Z7rf+kbpKIV+eRiS3Gi5jUMcf7Jp7pCn8Wc/iFVREY4XUE+FdYx9Z6ZcSybn9d8YhVx9Z6ZcSybn9d8YhVx9Z6ZcSybn9d8YhVx9Z6ZcSybn9d8YhVx9Z6ZcSybn9d8YhVx9Z6ZXkInaGVGVyr+3QMutUzZeIzXyhW98kMldU9eGKpxIgPEUCsECaCVAKIpRIjPkQAsUKYCFIJIJZKjPgQAcQKYSJIJYBYKjHiQwQQK4SJIJUAYqnEiA8RQKwQJoJUAoilEiM+RKBlVhg6yWZQxzxy84ih9I45Xuggm0E8sTYBkj4ngFhzLlzdJIBYmwBJnxNArDkXrm4SQKxNgKTPCSDWnAtXNwkg1iZA0ucEEGvOhaubBBBrEyDpcwKINefC1U0CiLUJkPQ5AcSac+EqBCAAAQhAAAIQgAAEIAABCEAAAmkC/wDLIyo4MEmh4AAAAABJRU5ErkJggg=='
  },
  {
    id: 'wood_log',
    name: 'Wood Log',
    icon: 'https://d1u5p3l4wpay3k.cloudfront.net/minecraft_gamepedia/6/61/Oak_Log.png?version=510e23e9cf7fb6a7b7c996829b62bc06'
  },
  {
    id: 'wood_planks',
    name: 'Wood Planks',
    icon: 'https://d1u5p3l4wpay3k.cloudfront.net/minecraft_gamepedia/c/c1/Oak_Planks.png?version=2b3a58e057abd902125042177d889ae8',
    baseIngredients: [
      {
        count: 1,
        itemID: 'wood_log'
      }
    ],
    baseRecipes: [
      {
        count: 1,
        outputCount: 4,
        itemID: 'wood_log'
      }
    ],
    recipe: {
      outputCount: 4,
      ingredients: [
        {
          count: 1,
          itemID: 'wood_log'
        }
      ]
    }
  },
  {
    id: 'cobblestone',
    name: 'Cobblestone',
    icon: 'https://d1u5p3l4wpay3k.cloudfront.net/minecraft_gamepedia/6/67/Cobblestone.png?version=863bd51871726f33ff16311c1f468ced'
  }
];

