-module(strtest).
-export([strstart/0]).

strstart() ->
    Str0 = "dallas",
    Str1 = "dallas-",
    Str2 = "dallas-12",
    Str3 = "dallas-aat",
    Str4 = "dallas-aat-",
    Str5 = "dallas-aat-3",
    %io:format("~p: ~p~n", [Str0, string:substr(Str0, string:rchr(Str0, $-))]),
    io:format("~p: ~p~n", [Str1, string:substr(Str1, string:rchr(Str1, $-)+1)]),
    io:format("~p: ~p~n", [Str2, string:substr(Str2, string:rchr(Str2, $-))]),
    io:format("~p: ~p~n", [Str3, string:substr(Str3, string:rchr(Str3, $-))]),
    io:format("~p: ~p~n", [Str4, string:substr(Str4, string:rchr(Str4, $-))]),
    io:format("~p: ~p~n", [Str5, string:substr(Str5, string:rchr(Str5, $-))]).
