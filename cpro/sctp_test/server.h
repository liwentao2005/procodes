#pragma once

#include <sys/socket.h>
#include <netinet/in.h>
#include <netinet/sctp.h>

#define SERVER_PORT 6666
#define BUFFER_SIZE 1024
#define LISTEN_QUEUE 1000

class SctpServer
{
public:
    SctpServer();
    void start(void);

private:
    void listenSocket(void);
    void loop(void);

    int sockFd_;
    int msgFlags_;
    char readBuf_[BUFFER_SIZE];
    struct sockaddr_in clientAddr_;
    struct sockaddr_in serverAddr_;
    struct sctp_sndrcvinfo sri_;
    struct sctp_event_subscribe events_;
    int streamIncrement_;
    socklen_t len_;
    size_t readSize_;
};

