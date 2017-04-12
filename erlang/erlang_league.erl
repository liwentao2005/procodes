-module(erlang_league).

-export([exchange_x/2, exchange_int/2, exchange_int/3]).
-export([exchange/2, exchange_help/1]).
-export([fibonacci/4]).

-include("erlang_hacking.hrl").

exchange_int(Total, Elements) ->
    exchange_int(Total, [], Elements).

exchange_int(Total, Elements, [CurrCoin|RemCoin]) when Total >= CurrCoin ->
    NewChange = Elements ++ [CurrCoin],
    exchange_int(Total - CurrCoin, NewChange, [CurrCoin|RemCoin]);

exchange_int(Total, Elements, [_CurrCoin|RemCoin]) ->
    exchange_int(Total, Elements, RemCoin);

exchange_int(_, Elements, []) ->
    Elements.

exchange_x(Total, [E1|Elements]) ->
    Eles = exchange_int(Total, [E1|Elements]),
    case Eles of
        [] ->
            input_error;
        Eles ->
            io:format("Results:~w~n", [Eles]),
            exchange_x(Total, Elements)
    end.
%%% ------------------------------------------------------------------------------

%%%
%%% a simple way to exchange coins
%%%
exchange(Total, _Elements) ->
    ?TIMEON,
    Result = length(exchange_help(Total)),
    ?TIMEOFF(exchange_help),
    ?PRINT(Result).

exchange_help(Total) ->
    [{A,B,C} ||
        A <- lists:seq(0, Total div 5),
        B <- lists:seq(0, Total div 2),
        C <- lists:seq(0, Total),
        A*5 + B*2 + C == Total
    ].

%%% -------------------------------------------------------------------------------------
-spec fibonacci(number(), number(), number(), number()) -> number().

fibonacci(First, Second, N, Accuracy) 
  when is_number(First),is_number(Second),is_number(N),is_number(Accuracy) ->
    case N of
        0 -> input_error;
        1 -> First;
        2 -> Second;
        _ -> fibonacci(First, Second, 0, N-2, Accuracy, 0)
    end;
fibonacci(_First, _Second, _N, _Accuracy) ->
    input_error.

fibonacci(First, Second, M, N, Accuracy, Result) ->
    case N == M of 
        true -> Result;
        _ -> fibonacci(Second, First+Second, M+1, N, Accuracy, First+Second)
    end.

