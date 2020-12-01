package com.github.te170476.musicdsl.sound.generator;

public class WaveGenerator {
    int attribute = 110;
    public int sampleRate;
    public WaveGenerator(int sampleRate) {
        this.sampleRate = sampleRate;
    }

    public byte[] generate(double hertz, int length, IWaveGenerator waveGen) {
        return generate(hertz, length, 0, waveGen);
    }
    public byte[] generate(double hertz, int length, int offset, IWaveGenerator waveGen) {
        byte[] wave = new byte[length];
        for(int index = 0; index < wave.length; index++){
            var attributes = new Parameters(sampleRate, index + offset, hertz);
            wave[index] = (byte) (attribute * waveGen.apply(attributes));
        }
        return wave;
    }
}
