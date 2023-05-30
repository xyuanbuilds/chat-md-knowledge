// const openaiKey = "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";

const paramsBase = {
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  top_p: 0.8,
  presence_penalty: 1.0,
};

const API_URL = "https://api.openai.com/v1/chat/completions";

const reqParams = (content: string, stream: boolean = true) => ({
  ...paramsBase,
  messages: [{ role: "user", content }],
  stream,
});

const D = new TextDecoder();

const parseData = (v: Uint8Array): Record<string, any>[] => {
  const dataObjs = D.decode(v).split("\n\n");

  return dataObjs.reduce<Record<string, any>[]>((res, i) => {
    const str = i.replace(/^data: /, "");

    if (str === "[DONE]") {
      return res;
    } else if (!str) {
      return res;
    }

    res.push(JSON.parse(str));
    return res;
  }, []);
};

const chatFetch = async (
  message = "make a joke in ten word",
  onData = (chunks: any[]) => {
    console.log("dataChunks", chunks);
  },
  openaiKey: string,
  options: {
    onStart?: VoidFn;
    onSteaming?: VoidFn;
    onDone?: (res: string) => void;
    onFinally?: VoidFn;
    onError?: (err: Error) => void;
  } = {}
) => {
  options.onStart?.();
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify(reqParams(message)),
  })
    .then((response) => response.body)
    .then((rb) => {
      if (!rb) throw new Error("no body");
      const reader = rb.getReader();
      return new ReadableStream({
        start: (controller) => {
          options.onSteaming?.();
          const push = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              onData(parseData(value));
              push();
            });
          };
          push();
        },
      });
    })
    .then((stream) => {
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text();
    })
    .then((res) => {
      options.onDone?.(res);
      return res;
    })
    .catch((err) => {
      options.onError?.(err);
    })
    .finally(() => {
      options.onFinally?.();
    });
};

export interface KeyWordsRes {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: Usage;
  choices: Choice[];
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

export interface Message {
  role: string;
  content: string;
}

export const chatKeywordsFetch = async (
  message = "make a joke in ten word",
  openaiKey: string,
  options: {
    onStart?: VoidFn;
    onFinally?: VoidFn;
    onError?: (err: Error) => void;
    onDone?: (res: KeyWordsRes) => void;
  } = {}
) => {
  options.onStart?.();
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify(reqParams(message, false)),
  })
    .then((response) => response.body)
    .then((stream) => {
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      }).text();
    })
    .then((res) => {
      options.onDone?.(JSON.parse(res) as KeyWordsRes);
      return res;
    })
    .catch((err) => {
      options.onError?.(err);
    })
    .finally(() => {
      options.onFinally?.();
    });
};

export default chatFetch;
