# Compressed textures

Compressed textures (`.dds`, `.dxt`, `.ktx`, `.basis`, etc) are not well-suited for pixel art because they are lossy.

## Attempt

```ts
import parse from 'parse-dds';

loadTextures(sources: string[]) {
  return new Promise<void>(async (resolve) => {
    // Create and bind texture
    const texture = this.gl.createTexture() as WebGLTexture;
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, texture);

    const ext = this.gl.getExtension('WEBGL_compressed_texture_s3tc');
    if (!ext) {
      return;
    }
    const dataArrayBuffer = await fetch(sources[0]);
    const buffer = await dataArrayBuffer.arrayBuffer();
    const data = new Uint8Array(buffer);

    const dds = parse(buffer);

    this.maxTextureSize = 1000;

    // Create a texture array with the max size
    this.gl.texStorage3D(
      this.gl.TEXTURE_2D_ARRAY,
      1,
      ext.COMPRESSED_RGBA_S3TC_DXT5_EXT,
      this.maxTextureSize,
      this.maxTextureSize,
      sources.length
    );

    // Add each image in the texture array
    for (let index = 0; index < sources.length; index += 1) {
      this.gl.compressedTexSubImage3D(
        this.gl.TEXTURE_2D_ARRAY,
        0,
        0,
        0,
        index,
        992,
        160,
        1,
        ext.COMPRESSED_RGBA_S3TC_DXT5_EXT,
        data,
        128,
        158720
      );

      // Save the depth of each source in the array
      this.textureSourcesIndex[sources[index]] = index;
    }

    // Texture settings
    this.gl.texParameteri(
      this.gl.TEXTURE_2D_ARRAY,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D_ARRAY,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D_ARRAY,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D_ARRAY,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );

    resolve();
  });
}
```
