---
title: 'NLP技术演进'
pubDate: 2021-04-04
description: '简述NLP技术近年来技术演进'
author: 'binlong Zhang'
tags: ["NLP", "技术演进", "深度学习"]
---
> description: '简述NLP技术近年来技术演进'

# Basic

## Text to Sequence

![image.png](NLP技术演进/1.png)

![image.png](NLP技术演进/2.png)

**分词的算法大致分为两种：**

1.基于词典的分词算法

正向最大匹配算法 逆向最大匹配算法 双向匹配分词法

2.基于统计的机器学习算法

N-gram、HMM、CRF、SVM、LSTM+CRF

**jieba分词的框架图**


![image](NLP技术演进/3.jpg)

## Word Embedding

1. **First**,represent words using one-hot vectors.

1. 1. Suppose the dictionary contain V unique words;
   2. then the one-hot vectors ![img](https://cdn.nlark.com/yuque/__latex/f4b3b6c1c603e6ffb626b2e6effa689a.svg) are v-dimensional;

![image.png](NLP技术演进/4.png)

1. **second**,map the one-hot vectors to low-dimensional vectors

1. 1. P is parameter matrix which can be **learned from training data;**
   2. ![img](https://cdn.nlark.com/yuque/__latex/8dec559e201a7b6a0f99baeaa1731051.svg)is the one-hot vector of the i-th word in dictonary;

**How to interpret the parameter matrix?**

![image.png](NLP技术演进/5.png)

![image.png](NLP技术演进/6.png)

### Model

> 无监督训练**word2vec**的两种模型：CBOW和skip-gram


![14.png](NLP技术演进/7.png)

![15.png](NLP技术演进/8.png)

### Tip

![17.png](NLP技术演进/9.png)

 如果一个语料库稍微大一些，可能的结果简直太多了，最后一层相当于softmax，计算起来十分耗时，有什么办法来解决嘛？

- 输入两个单词，看他们是不是前后对应的输入和输出，也就相当于一个二分类任务

  ![19.png](NLP技术演进/10.png)
- 出发点非常好，但是此时训练集构建出来的标签全为1，无法进行较好的训练
- 改进方案：加入一些负样本（**负采样模型**）

  ![21.png](NLP技术演进/11.png)

# Use word Classification

**至此就可以尝试使用各种分类器对齐进行分类,**

### ShortComing

仅仅是利用词的统计和频率分类，没有考虑序列；

# RNN(Recurrent Neural Networks) 

> using RNN to instead simple Classification

![image.png](NLP技术演进/12.png)

## Simple RNN

![image.png](NLP技术演进/13.png)

注意上述结构中的**双曲正切函数**是必要的，用于防止传递过程中发生的A的n次方导致后方序列失去效果！

### ShortComing

- SimpleRNN is good at short-term dependence;
- SimpleRNN is bad at long-term dependence;
- Only one such parameter matrix,no matter how long the sequence is;

![image.png](NLP技术演进/14.png)

![image.png](NLP技术演进/15.png)

## LSTM Model(Using LSTM instead Simple RNN)

> Hochreiter and Schmidhuber. Long short-term memory. Neural computation, 1997.

- **Conveyor belt**: **the past information directly flows to the future.(解决梯度消失)**
- Each of the following blocks has a parameter matrix:
- - **Forget gate****:**forget the gender of the old subject.
  - **Input gate**:decides which values of the conveyor belt we’ll update.
  - **New value (**![img](https://cdn.nlark.com/yuque/__latex/5ebea707e73f58aeb693a6839f40beaa.svg)**)**: to be added to the conveyor belt
  - **Output gate****:**decide what flows from the conveyor belt![img](https://cdn.nlark.com/yuque/__latex/b2236e0874d0f2ae943cd6bd45752b03.svg)to the state ![img](https://cdn.nlark.com/yuque/__latex/6c4ff69dbcc329835a33b80fe3a145c7.svg).
- Number of parameters:
  - 4 * *shape*(h)  *  [*shape*(h) + *shape*(x)]

**Gate Struct**

![image.png](NLP技术演进/16.png)

**Update**

![image.png](NLP技术演进/17.png)

## RNN More Effective

### Stacked RNN

![image.png](NLP技术演进/18.png)

### Bidirectional RNN

![image.png](NLP技术演进/19.png)

### Pretraining 

![image.png](NLP技术演进/20.png)

# Seq2Seq

![image.png](NLP技术演进/21.png)

How to Improve?

- Bi-LSTM instead of LSTM;(Encoder ONLY!)
- Tokenization in the word-level(instead of char-level);
- Multitask learning;
- Attention

# Attention

>  Bahdanau,Cho,& Bengio. Neural	machine	translation by jointly learning to align and translate. In ICLR, 2015.

- Attention tremendously improves Seq2Seq model. 
- With attention, Seq2Seq model does not forget source input. 
- With attention, the decoder knows where to focus. 
- Downside: much more computation.

![image.png](NLP技术演进/22.png)

**Much ways to calculate Weight:**

![image.png](NLP技术演进/23.png)

![image.png](NLP技术演进/24.png)

![image.png](NLP技术演进/25.png)


![image.png](NLP技术演进/26.png)

![image.png](NLP技术演进/27.png)

# Self-Attention

通用性更强，跳出了seq to seq 的局限；

![image.png](NLP技术演进/28.png)

![image.png](NLP技术演进/29.png)

![image.png](NLP技术演进/30.png)

![image.png](NLP技术演进/31.png)


# Attention to seq2seq

![image.png](NLP技术演进/32.png)

# Transformer

> 1. **Bahdanau, Cho, & Bengio.** Neural machine translation by jointly learning to align and
>    translate. **In ICLR, 2015.**
> 2. **Cheng, Dong, & Lapata.** Long Short-Term Memory-Networks for Machine Reading. **In**
>    **EMNLP, 2016.**
> 3. **Vaswani et al.** Attention Is All You Need**. In NIPS, 2017.**

- Transformer is a Seq2Seq model.
- Transformer is not RNN.
- Purely based attention and dense layers.
- Higher accuracy than RNNs on large datasets.

![image.png](NLP技术演进/33.png)

## Attention without RNN

![image.png](NLP技术演进/34.png)

![image.png](NLP技术演进/35.png)

![image.png](NLP技术演进/36.png)

![image.png](NLP技术演进/37.png)

![image.png](NLP技术演进/38.png)

## Self-Attention without RNN

![image.png](NLP技术演进/39.png)

## Transformer

![image.png](NLP技术演进/40.png)

![image.png](NLP技术演进/41.png)

![image.png](NLP技术演进/42.png)

![image.png](NLP技术演进/43.png)

![image.png](NLP技术演进/44.png)

![image.png](NLP技术演进/45.png)


- Transformer is Seq2Seq model; it has an encoder and a decoder.
- Transformer model is not RNN.
- Transformer is based on attention and self-attention.
- Transformer outperforms all the state-of-the-art RNN models.

## BERT(Bidirectional Encoder Representationsfrom Transformers)

> 1. Devlin, Chang, Lee, and Toutanova. BERT: Pre-training of deep bidirectional transformers for language understanding. In ACL, 2019.
>
> 2. Vaswani and others. Attention is all you need. In NIPS, 2017.

**Main:**

- Predict masked word.
- Predict next sentence.

**Combining the two methods**

- Loss 1 is for binary classification (i.e., predicting the nextsentence.)
- Loss 2 and Loss 3 are for multi-class classification (i.e., predicting the masked words.)
- Objective function is the **sum of the three loss functions.**
- **Update model parameters** by performing one gradient descent.

**Data**

- BERT does not need manually labeled data. (Nice! Manual labeling is expensive.)
- Use large-scale data, e.g., English Wikipedia (2.5 billion words.)
- Randomly mask words (with some tricks.)
- 50% of the next sentences are real. (The other 50% are fake.)